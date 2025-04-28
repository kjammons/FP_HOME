<script>
    import { onMount } from "svelte";
    import { base } from '$app/paths';

    // Define the deeds array with bounding box (bbox) coordinates and alert messages
    const deeds = [
        {
            id: 1,
            name: "Covenant recorded on May 6, 1878 in East Chelmesford, MA",
            description: "According to the record, this 1878 property deed was conveyed by Arathusa F. Dyar. This early covenant does not explicitly invoke race. Instead, the language focuses on behavioral norms such as cleanliness, orderliness, and sobriety as conditions for tenancy. However, even at this early stage, ideas about respectability and moral conduct were overtly racialized. Such clauses laid groundwork for later racial exclusions by linking property ownership with specific, encoded standards of belonging and power.",
            bbox: [[147, 1506.6], [1388, 1620.4]], // Bounding box coordinates
            image: `${base}/images/covenant_1.jpg`, // Path to the image
            alertMessage: "This deed reads: “He shall keep the premises hereby leased neat and orderly and allow no liquor drunk or disorderly conduct upon the premises.” We are not interpreting this as a restrictive covenant, but it illustrates the stucture that covenants will be added to."
        },
        {
            id: 2,
            name: "Covenant recorded on June 22, 1880 in Wilmington, MA",
            description: "According to the record, this 1880 property deed was conveyed by Charles D. Wild. This covenant explicitly excludes both Black people and Irish immigrants, inserted within the framework of the familiar “disorderly” language. At this time, Irish Americans occupied a tenuous racial position, being not fully accepted as white. This document captures the fluidity and evolution of racial boundaries, showing how whiteness was actively under social construction. ",
            bbox: [[168, 1437.2], [1514, 1587.8]],
            image: `${base}/images/covenant_2.jpg`,
            alertMessage: "You found a restrictive covenant! This deed reads: “That said premises are to be used as a place of residence only and are not to be occupied or conveyed to any Negroes or Irish or any person or persons that would be considered disorderly people."
        },
        {
            id: 3,
            name: "Covenant recorded on May 10, 1924 in Wilmington, MA",
            description: "According to the record, this 1924 property deed was conveyed by Maria M. Lenfest and Granville S. Lenfest. By the 1920s, Irish residents of Massachusetts had largely been assimilated into whiteness. Here, the covenants' racial exclusions narrow, targeting specifically Black residents. The repetition of the disorderly people clause suggests that behavioral justifications for exclusion persisted, but the racial line had hardened. This covenant reflects a suburbanizing Massachusetts increasingly structured around maintaining structures of white spatial dominance.",
            bbox: [[367, 2087], [1808, 2220]],
            image: `${base}/images/covenant_3.jpg`,
            alertMessage: "You found a restrictive covenant! This deed reads: “that, the said premises are to be used as a place of residence only and are not to be occupied or conveyed to any Negroes or any person or persons that would be considered disorderly people.”"
        },
        {
            id: 4,
            name: "Covenant recorded November 28, 1939 in Dracut, MA",
            description: "According to the record, this 1939 property deed was conveyed by Fred E. Kroker and Ethel W. Kroker. By 1939, the language of exclusion became explicitly “biological” and pseudo-scientific. 'Caucasian' is a term borrowed from racial anthropology and which entered into common legal usage to define who property access. This reflects the growing normalization of “whiteness,” nebulously defined, as a legally enforceable category, amid a broader culture of segregation and racial hierarchy.",
            bbox: [[490, 2157], [1964, 2332]],
            image: `${base}/images/covenant_4.jpg`,
             alertMessage: "You found a restrictive covenant! This deed reads: “That no part of the land hereby conveyed, or the improvements thereon, shall ever be sold, leased, traded, rented or donated to any one other than the Caucasian race.”"
        },
        {
            id: 5,
            name: "Covenant recorded April 7, 1950 in Dracut, MA",
            description: "According to the record, this 1950 property deed was conveyed by E. Gaston Campbell, Frank J. Rochette, and Thomas Rochette. This covenant is nearly identical to the previous deed from 1939, illustrating the persistence of racial covenants even as legal challenges mounted. By 1950, Shelley v. Kraemer (1948) had already ruled that courts could not enforce restrictive covenants. However, many property owners continued to insert racial restrictions into deeds. The social construction of whiteness remained deeply embedded in real estate practices, shaping patterns of segregation that would endure long after explicit legal enforcement ended. Today, these covenants can still be found in property deeds, continuing to “run with the land.” ",
            bbox: [[265, 1691.6], [2442, 1893.4]],
            image: `${base}/images/covenant_5.jpg`,
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

<h2>What are restrictive covenants?</h2>

<p>A racially restrictive covenant is a legal clause inserted into a property deed prohibiting the sale, lease, and occupation of property to people of specific races, ethnicities, or religions. Although the record is mixed due to incomplete data and analog documents that were never digitized, restrictive covenants have been identified and documented across the country. According to the National Covenants Research Coalition, “​​Covenants come in a variety of forms. They could be plat restrictions, established by a real estate developer from the time a subdivision was laid out. They could be agreements, signed by residents in a neighborhood, never to sell, lease, or allow occupancy by someone who was not Caucasian, then filed with the county recorder of deeds. They could be private block restrictions on a small enclave within a city. They could be a short clause within a deed document, where the restriction or covenant language was embedded in every deed document when the property was transferred.”</p>

<p>The covenants employed distinct language and mechanisms of exclusion. Sometimes they were blunt, excluding particular racial, ethnic, or national groups outright. Over time, the language shifted to be less precise and more encompassing, employing euphemistic terms like “Caucasian only.” These covenants, still on the record today, are not merely historical artifacts. These covenants are evidence of the hidden scaffolding of inequality, which continues to shape who has access to opportunity, wealth, and security today. Making these covenants visible is both a manifestation of historical recovery and a political act.</p>

<p>The following covenants tell a contextualized story of the social construction of whiteness as embodied in five covenants spanning 1878-1950 in Northern Middlesex County. In this module, we trace the literal language of exclusion, highlighting changes and generalizations as strategies of white spatial dominance evolved and took on new forms. So that you can familiarize yourself with the deeds and covenants, the authors have provided the raw data in the form of scanned images from the Northern Middlesex County Registry of Deeds Office. The restrictive covenant has been identified and highlighted for ease of interaction. For each covenant, please click on the identified covenant to read its full text and to trace the social construction of whiteness for yourself.</p>


<h2>Tracing the social construction of whiteness in Middlesex County</h2>

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
 