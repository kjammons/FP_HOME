<script>
    import { onMount } from "svelte";

    // Define the deeds array with bounding box (bbox) coordinates
    const deeds = [
        {
            id: 1,
            name: "Covenant 1",
            description: "This is the first covenant.",
            bbox: [[147, 1533], [1388, 1594]], // Bounding box coordinates
            image: "public/images/covenant_1.jpg" 
        },
        {
            id: 2,
            name: "Covenant 2",
            description: "This is the second covenant.",
            bbox: [[168, 1454], [1514, 1571]], 
            image: "public/images/covenant_2.jpg"
        },
        {
            id: 3,
            name: "Covenant 3",
            description: "This is the third covenant.",
            bbox: [[367, 2087], [1808, 2220]], 
            image: "public/images/covenant_3.jpg"
        },
        {
            id: 4,
            name: "Covenant 4",
            description: "This is the fourth covenant.",
            bbox: [[490, 2157], [1964, 2332]], 
            image: "public/images/covenant_4.jpg"
        },
        {
            id: 5,
            name: "Covenant 5",
            description: "This is the fifth covenant.",
            bbox: [[265, 1713], [2442, 1872]], 
            image: "public/images/covenant_5.jpg"
        }
    ];

    let innerWidth = window.innerWidth;

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
            alert("You found the covenant!");
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
        innerWidth = window.innerWidth;
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
</style>