<script>
    import { onMount } from "svelte";
    // Define the deeds array with bounding box coordinates
    const deeds = [
        {
            id: 1,
            name: "Covenant 1",
            description: "This is the first covenant.",
            covenant: [[147, 1533], [1388, 1594]], 
            image: "public/images/covenant_1.jpg" 
        },
        {
            id: 2,
            name: "Covenant 2",
            description: "This is the second covenant.",
            covenant: [[168, 1454], [1514, 1571]], 
            image: "public/images/covenant_2.jpg"
        },
        {
            id: 3,
            name: "Covenant 3",
            description: "This is the third covenant.",
            covenant: [[367, 2087], [1808, 2220]], 
            image: "public/images/covenant_3.jpg"
        },
        {
            id: 4,
            name: "Covenant 4",
            description: "This is the fourth covenant.",
            covenant: [[490, 2157], [1964, 2332]], 
            image: "public/images/covenant_4.jpg"
        },
        {
            id: 5,
            name: "Covenant 5",
            description: "This is the fifth covenant.",
            covenant: [[265,1713], [2442,1872]], 
            image: "public/images/covenant_5.jpg"
        }
    ];

    let innerWidth = window.innerWidth;
    // Function to handle image click
    function handleClick(event, deed) {
        let boundingBox = deed.covenant;
        let [topLeft, bottomRight] = boundingBox;
        console.log(boundingBox);

        // event.target.width: the width of the image in the browser
        // event.target.naturalWidth: the original width of the image
        // event.offsetX (or Y): the x-coordinate of the click relative to the image
        const clickX = (event.offsetX / event.target.width) * event.target.naturalWidth;
        const clickY = (event.offsetY / event.target.height) * event.target.naturalHeight;
        console.log(clickX, clickY);



        // Check if the click is within the bounding box
        if (
            clickX >= topLeft[0] &&
            clickX <= bottomRight[0] &&
            clickY >= topLeft[1] &&
            clickY <= bottomRight[1]
        ) {
            alert("You found the covenant!");
        }
    }

       // Function to calculate and draw the bounding box
       function drawBoundingBox(imageElement, boundingBoxElement, covenant) {
        const [topLeft, bottomRight] = covenant;

        // Get the natural dimensions of the image
        const naturalWidth = imageElement.naturalWidth;
        const naturalHeight = imageElement.naturalHeight;

        // Get the rendered dimensions of the image
        const renderedWidth = imageElement.offsetWidth;
        const renderedHeight = imageElement.offsetHeight;

        // Calculate scaling factors
        const scaleX = renderedWidth / naturalWidth;
        const scaleY = renderedHeight / naturalHeight;

        // Calculate the scaled bounding box dimensions
        const left = topLeft[0] * scaleX;
        const top = topLeft[1] * scaleY;
        const width = (bottomRight[0] - topLeft[0]) * scaleX;
        const height = (bottomRight[1] - topLeft[1]) * scaleY;

        // Apply styles to the bounding box element
        boundingBoxElement.style.left = `${left}px`;
        boundingBoxElement.style.top = `${top}px`;
        boundingBoxElement.style.width = `${width}px`;
        boundingBoxElement.style.height = `${height}px`;
        boundingBoxElement.style.position = "absolute";
        boundingBoxElement.style.border = "2px solid yellow";
        boundingBoxElement.style.pointerEvents = "none";
    }
    
    // Function to initialize bounding boxes
    function initializeBoundingBoxes() {
        deeds.forEach((deed) => {
            const imageElement = document.getElementById(`image-${deed.id}`);
            const boundingBoxElement = document.getElementById(`bounding-box-${deed.id}`);

            if (imageElement && boundingBoxElement) {
                // Draw the bounding box initially
                drawBoundingBox(imageElement, boundingBoxElement, deed.covenant);
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

    // Initialize bounding boxes after the component is mounted
    onMount(() => {
        initializeBoundingBoxes();
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
        <!-- Render the bounding box -->
        <div id={`bounding-box-${deed.id}`}></div>
        <!-- <div
            style="
                position: absolute;
                top: {deed.covenant[0][1]}px;
                left: {deed.covenant[0][0]}px;
                width: {deed.covenant[1][0] - deed.covenant[0][0]}px;
                height: {deed.covenant[1][1] - deed.covenant[0][1]}px;
                border: 2px solid yellow;
                pointer-events: none;
            "
        ></div> -->
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