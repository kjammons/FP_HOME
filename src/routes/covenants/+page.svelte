<script>
    import { onMount } from "svelte";


    // Define the deeds array with bounding box (bbox) coordinates and alert messages
    const deeds = [
        {
            id: 1,
            name: "Covenant 1",
            description: "Grantor: Arathusa F. Dyar. Date Recorded: May 06, 1878. Location: East Chelmsford, MA",
            bbox: [[147, 1533], [1388, 1594]], // Bounding box coordinates
            image: "./src/lib/assets/images/covenant_1.jpg", // Path to the image
            alertMessage: "This deed reads: “He shall keep the premises hereby leased neat and orderly and allow no liquor drunk or disorderly conduct upon the premises.” We are not interpreting this as a restrictive covenant, but it illustrates the stucture that covenants will be added to."
        },
        {
            id: 2,
            name: "Covenant 2",
            description: "Grantor: Charles D. Wild. Date Recorded: June 22, 1880. Location: Wilmington, MA",
            bbox: [[168, 1454], [1514, 1571]],
            image: "./src/lib/assets/images/covenant_2.jpg",
            alertMessage: "You found a restrictive covenant! This deed reads: “That said premises are to be used as a place of residence only and are not to be occupied or conveyed to any Negroes or Irish or any person or persons that would be considered disorderly people."
        },
        {
            id: 3,
            name: "Covenant 3",
            description: "Grantor: Maria M. Lenfest and Granville S. Lenfest. Date Recorded: May 10, 1924. Location: Wilmington, MA",
            bbox: [[367, 2087], [1808, 2220]],
            image: "./src/lib/assets/images/covenant_3.jpg",
            alertMessage: "You found a restrictive covenant! This deed reads: “that, the said premises are to be used as a place of residence only and are not to be occupied or conveyed to any Negroes or any person or persons that would be considered disorderly people.”"
        },
        {
            id: 4,
            name: "Covenant 4",
            description: "Grantors: Fred E. Kroker, Ethel W. Kroker. Date Recorded: November 28, 1939. Location: Dracut, MA",
            bbox: [[490, 2157], [1964, 2332]],
            image: "./src/lib/assets/images/covenant_4.jpg",
            alertMessage: "You found a restrictive covenant! This deed reads: “That no part of the land hereby conveyed, or the improvements thereon, shall ever be sold, leased, traded, rented or donated to any one other than the Caucasian race.”"
        },
        {
            id: 5,
            name: "Covenant 5",
            description: "Grantors: E. Gaston Campbell, Frank J. Rochette, and Thomas Rochette. Date Recorded: April 7, 195. Location: Dracut, MA",
            bbox: [[265, 1713], [2442, 1872]],
            image: "./src/lib/assets/images/covenant_5.jpg",
            alertMessage: "You found a restrictive covenant! This deed reads: “No part of the land hereby conveyed shall ever be conveyed, leased, traded, rented or donated to anyone who is not a member of the caucasian race.”"
        }
    ];

    let showAlert = false; // Controls the visibility of the alert
    let alertMessage = ""; // The message to display in the alert

    // Function to show the custom alert
    function showCustomAlert(message) {
        alertMessage = message;
        showAlert = true;
    }

    // Function to close the custom alert
    function closeAlert() {
        showAlert = false;
    }

    // Function to calculate scaling factors and apply them to the bounding box
    function calculateScaledBBox(imageElement, bbox) {
        const [topLeft, bottomRight] = bbox;

        // Get the natural dimensions of the image
        const naturalWidth = imageElement.naturalWidth;
        const naturalHeight = imageElement.naturalHeight;

        // Get the rendered dimensions of the image
        const renderedWidth = imageElement.offsetWidth;
        const renderedHeight = imageElement.offsetHeight;

        // Calculate scaling factors
        const scaleX = renderedWidth / naturalWidth;
        const scaleY = renderedHeight / naturalHeight;

        // Scale the bounding box coordinates
        const scaledTopLeft = [topLeft[0] * scaleX, topLeft[1] * scaleY];
        const scaledBottomRight = [bottomRight[0] * scaleX, bottomRight[1] * scaleY];

        return { scaledTopLeft, scaledBottomRight };
    }

    // Function to draw the bounding box
    function drawBoundingBox(imageElement, boundingBoxElement, bbox) {
        const { scaledTopLeft, scaledBottomRight } = calculateScaledBBox(imageElement, bbox);

        // Get the image's position relative to its container
        const imageRect = imageElement.getBoundingClientRect();
        const containerRect = boundingBoxElement.offsetParent.getBoundingClientRect();

        // Calculate the scaled bounding box dimensions
        const left = imageRect.left - containerRect.left + scaledTopLeft[0];
        const top = imageRect.top - containerRect.top + scaledTopLeft[1];
        const width = scaledBottomRight[0] - scaledTopLeft[0];
        const height = scaledBottomRight[1] - scaledTopLeft[1];

        // Apply styles to the bounding box element
        boundingBoxElement.style.left = `${left}px`;
        boundingBoxElement.style.top = `${top}px`;
        boundingBoxElement.style.width = `${width}px`;
        boundingBoxElement.style.height = `${height}px`;
        boundingBoxElement.style.position = "absolute";
        boundingBoxElement.style.border = "2px solid yellow";
        boundingBoxElement.style.pointerEvents = "none"; // Ensure it doesn't block clicks
    }

    // Function to handle image click
    function handleClick(event, deed) {
        const imageElement = event.target;
        const { scaledTopLeft, scaledBottomRight } = calculateScaledBBox(imageElement, deed.bbox);

        // Scale the click coordinates
        const clickX = event.offsetX;
        const clickY = event.offsetY;

        // Check if the click is within the bounding box
        if (
            clickX >= scaledTopLeft[0] &&
            clickX <= scaledBottomRight[0] &&
            clickY >= scaledTopLeft[1] &&
            clickY <= scaledBottomRight[1]
        ) {
            showCustomAlert(deed.alertMessage); // Show the alert specific to the deed
        }
    }

    // Function to initialize bounding boxes
    function initializeBoundingBoxes() {
        deeds.forEach((deed) => {
            const imageElement = document.getElementById(`image-${deed.id}`);
            const boundingBoxElement = document.getElementById(`bounding-box-${deed.id}`);

            if (imageElement && boundingBoxElement) {
                // Wait for the image to load before drawing the bounding box
                imageElement.addEventListener("load", () => {
                    drawBoundingBox(imageElement, boundingBoxElement, deed.bbox);
                });

                // If the image is already loaded (e.g., cached), draw the bounding box immediately
                if (imageElement.complete) {
                    drawBoundingBox(imageElement, boundingBoxElement, deed.bbox);
                }
            }
        });
    }

    // Function to handle window resize
    function onResize() {
        initializeBoundingBoxes(); // Redraw bounding boxes on resize
    }

    // Add and remove event listeners on mount/unmount
    onMount(() => {
        window.addEventListener('resize', onResize);
        initializeBoundingBoxes(); // Initialize bounding boxes on mount

        return () => {
            window.removeEventListener('resize', onResize);
        };
    });
</script>

<h1>Covenants</h1>

<!-- Custom Alert Modal -->
{#if showAlert}
    <div class="modal-overlay" on:click={closeAlert}>
        <div class="modal" on:click|stopPropagation>
            <h2>{alertMessage}</h2>
            <button on:click={closeAlert}>OK</button>
        </div>
    </div>
{/if}

<!-- Render the deeds dynamically -->
{#each deeds as deed}
    <div id={deed.id} style="position: relative;">
        <h2>{deed.name}</h2>
        <p>{deed.description}</p>
        <img
            id={`image-${deed.id}`}
            src={deed.image}
            alt={deed.name}
            on:click={(event) => handleClick(event, deed)}
            style="cursor: pointer; display: block; max-width: 100%; height: auto;"
        />
        <!-- Bounding box -->
        <div id={`bounding-box-${deed.id}`}></div>
    </div>
{/each}

<style>
    h1 {
        text-align: center;
        color: #333;
    }

    div {
        margin: 20px;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
    }

    img {
        max-width: 100%;
        height: auto;
        display: block;
        margin-top: 10px;
    }

    /* Modal background overlay */
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    /* Modal content */
    .modal {
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        text-align: center;
        max-width: 300px;
        width: 90%;
        font-family: 'Georgia', 'Times New Roman', serif; /* Archival font style */
    }

    .modal h2 {
        margin: 0 0 10px;
        font-size: 18px;
        color: #333;
        font-family: 'Georgia', 'Times New Roman', serif; /* Archival font style */
    }

    .modal button {
        background: #007bff;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        font-family: 'Georgia', 'Times New Roman', serif; /* Archival font style */
    }

    .modal button:hover {
        background: #0056b3;
    }
</style>