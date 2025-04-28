<script>
    import { onMount } from "svelte";


    // Define the deeds array with bounding box (bbox) coordinates and alert messages
    const deeds = [
        {
            id: 1,
            name: "Covenant recorded on May 6, 1878 in East Chelmesford, MA",
            description: "According to the record, this 1878 property deed was conveyed by Arathusa F. Dyar.",
            bbox: [[147, 1506.6], [1388, 1620.4]], // Bounding box coordinates
            image: "./src/lib/assets/images/covenant_1.jpg", // Path to the image
        },
        {
            id: 2,
            name: "Covenant recorded on June 22, 1880 in Wilmington, MA",
            description: "According to the record, this 1880 property deed was conveyed by Charles D. Wild.",
            bbox: [[168, 1437.2], [1514, 1587.8]],
            image: "./src/lib/assets/images/covenant_2.jpg",
        },
        {
            id: 3,
            name: "Covenant recorded on May 10, 1924 in Wilmington, MA",
            description: "According to the record, this 1924 property deed was conveyed by Maria M. Lenfest and Granville S. Lenfest.",
            bbox: [[367, 2087], [1808, 2220]],
            image: "./src/lib/assets/images/covenant_3.jpg",
        },
        {
            id: 4,
            name: "Covenant recorded November 28, 1939 in Dracut, MA",
            description: "According to the record, this 1939 property deed was conveyed by Fred E. Kroker and Ethel W. Kroker.",
            bbox: [[490, 2157], [1964, 2332]],
            image: "./src/lib/assets/images/covenant_4.jpg",
        },
        {
            id: 5,
            name: "Covenant recorded April 7, 1950 in Dracut, MA",
            description: "According to the record, this 1950 property deed was conveyed by E. Gaston Campbell, Frank J. Rochette, and Thomas Rochette.",
            bbox: [[265, 1691.6], [2442, 1893.4]],
            image: "./src/lib/assets/images/covenant_5.jpg",
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
        boundingBoxElement.style.border = "10px solid yellow";
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

<h1>Understanding Restrictive Covenants</h1>

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
    /* Apply the Courier font to the entire page */
    * {
        font-family: 'Courier', monospace;
    }

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
    }

    .modal h2 {
        margin: 0 0 10px;
        font-size: 18px;
        color: #333;
    }

    .modal button {
        background: #007bff;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
    }

    .modal button:hover {
        background: #0056b3;
    }
</style>
 