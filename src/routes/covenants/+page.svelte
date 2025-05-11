<script>
    import { onMount } from "svelte";
    import { base } from '$app/paths';
  
    // Define the deeds array
    const deeds = [
      {
        id: 1,
        name: "Covenant recorded on May 6, 1878 in East Chelmesford, MA",
        description: `According to the record, this 1878 property deed was conveyed by Arathusa F. Dyar. This early covenant does not explicitly invoke race. Instead, the language focuses on behavioral norms such as cleanliness, orderliness, and sobriety as conditions for tenancy. However, even at this early stage, ideas about respectability and moral conduct were overtly racialized. Such clauses laid groundwork for later racial exclusions by linking property ownership with specific, encoded standards of belonging and power.`,
        bbox: [[147, 1506.6], [1388, 1620.4]],
        image: `${base}/images/covenant_1.jpg`,
        alertMessage: `This deed reads: “He shall keep the premises hereby leased neat and orderly and allow no liquor drunk or disorderly conduct upon the premises.” We are not interpreting this as a restrictive covenant, but it illustrates the structure that covenants will be added to.`
      },
      {
        id: 2,
        name: "Covenant recorded on June 22, 1880 in Wilmington, MA",
        description: `According to the record, this 1880 property deed was conveyed by Charles D. Wild. This covenant explicitly excludes both Black people and Irish immigrants, inserted within the framework of the familiar “disorderly” language. At this time, Irish Americans occupied a tenuous racial position, being not fully accepted as white. This document captures the fluidity and evolution of racial boundaries, showing how whiteness was actively under social construction.`,
        bbox: [[168, 1437.2], [1514, 1587.8]],
        image: `${base}/images/covenant_2.jpg`,
        alertMessage: `You found a restrictive covenant! This deed reads: “That said premises are to be used as a place of residence only and are not to be occupied or conveyed to any Negroes or Irish or any person or persons that would be considered disorderly people.”`
      },
      {
        id: 3,
        name: "Covenant recorded on May 10, 1924 in Wilmington, MA",
        description: `According to the record, this 1924 property deed was conveyed by Maria M. Lenfest and Granville S. Lenfest. By the 1920s, Irish residents of Massachusetts had largely been assimilated into whiteness. Here, the covenants' racial exclusions narrow, targeting specifically Black residents. The repetition of the disorderly people clause suggests that behavioral justifications for exclusion persisted, but the racial line had hardened. This covenant reflects a suburbanizing Massachusetts increasingly structured around maintaining structures of white spatial dominance.`,
        bbox: [[367, 2087], [1808, 2220]],
        image: `${base}/images/covenant_3.jpg`,
        alertMessage: `You found a restrictive covenant! This deed reads: “that, the said premises are to be used as a place of residence only and are not to be occupied or conveyed to any Negroes or any person or persons that would be considered disorderly people.”`
      },
      {
        id: 4,
        name: "Covenant recorded November 28, 1939 in Dracut, MA",
        description: `According to the record, this 1939 property deed was conveyed by Fred E. Kroker and Ethel W. Kroker. By 1939, the language of exclusion became explicitly “biological” and pseudo-scientific. 'Caucasian' is a term borrowed from racial anthropology and which entered into common legal usage to define who property access. This reflects the growing normalization of “whiteness,” nebulously defined, as a legally enforceable category, amid a broader culture of segregation and racial hierarchy.`,
        bbox: [[490, 2157], [1964, 2332]],
        image: `${base}/images/covenant_4.jpg`,
        alertMessage: `You found a restrictive covenant! This deed reads: “That no part of the land hereby conveyed, or the improvements thereon, shall ever be sold, leased, traded, rented or donated to any one other than the Caucasian race.”`
      },
      {
        id: 5,
        name: "Covenant recorded April 7, 1950 in Dracut, MA",
        description: `According to the record, this 1950 property deed was conveyed by E. Gaston Campbell, Frank J. Rochette, and Thomas Rochette. This covenant is nearly identical to the previous deed from 1939, illustrating the persistence of racial covenants even as legal challenges mounted. By 1950, Shelley v. Kraemer (1948) had already ruled that courts could not enforce restrictive covenants. However, many property owners continued to insert racial restrictions into deeds. The social construction of whiteness remained deeply embedded in real estate practices, shaping patterns of segregation that would endure long after explicit legal enforcement ended. Today, these covenants can still be found in property deeds, continuing to “run with the land.”`,
        bbox: [[265, 1691.6], [2442, 1893.4]],
        image: `${base}/images/covenant_5.jpg`,
        alertMessage: `You found a restrictive covenant! This deed reads: “No part of the land hereby conveyed shall ever be conveyed, leased, traded, rented or donated to anyone who is not a member of the caucasian race.”`
      }
    ];
  
    let showAlert = false;
    let alertMessage = "";
  
    function showCustomAlert(message) {
      alertMessage = message;
      showAlert = true;
    }
  
    function closeAlert() {
      showAlert = false;
    }

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  
    function calculateScaledBBox(imageElement, bbox) {
      const [topLeft, bottomRight] = bbox;
      const naturalW = imageElement.naturalWidth;
      const naturalH = imageElement.naturalHeight;
      const renderedW = imageElement.offsetWidth;
      const renderedH = imageElement.offsetHeight;
      const scaleX = renderedW / naturalW;
      const scaleY = renderedH / naturalH;
      return {
        scaledTopLeft: [topLeft[0] * scaleX, topLeft[1] * scaleY],
        scaledBottomRight: [bottomRight[0] * scaleX, bottomRight[1] * scaleY]
      };
    }
  
    function drawBoundingBox(imgEl, boxEl, bbox) {
      const { scaledTopLeft, scaledBottomRight } = calculateScaledBBox(imgEl, bbox);
      const imgRect = imgEl.getBoundingClientRect();
      const containerRect = boxEl.offsetParent.getBoundingClientRect();
  
      const left = imgRect.left - containerRect.left + scaledTopLeft[0];
      const top  = imgRect.top  - containerRect.top  + scaledTopLeft[1];
      const width  = scaledBottomRight[0] - scaledTopLeft[0];
      const height = scaledBottomRight[1] - scaledTopLeft[1];
  
      Object.assign(boxEl.style, {
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`,
        position: "absolute",
        border: "10px solid red",
        pointerEvents: "none"
      });
    }
  
    function handleClick(event, deed) {
      const img = event.currentTarget.querySelector("img");
      const { scaledTopLeft, scaledBottomRight } = calculateScaledBBox(img, deed.bbox);
      const clickX = event.offsetX;
      const clickY = event.offsetY;
  
      if (
        clickX >= scaledTopLeft[0] &&
        clickX <= scaledBottomRight[0] &&
        clickY >= scaledTopLeft[1] &&
        clickY <= scaledBottomRight[1]
      ) {
        showCustomAlert(deed.alertMessage);
      }
    }
  
    function initializeBoundingBoxes() {
      deeds.forEach((deed) => {
        const imgEl = document.getElementById(`image-${deed.id}`);
        const boxEl = document.getElementById(`bounding-box-${deed.id}`);
        if (imgEl && boxEl) {
          imgEl.addEventListener("load", () => drawBoundingBox(imgEl, boxEl, deed.bbox));
          if (imgEl.complete) drawBoundingBox(imgEl, boxEl, deed.bbox);
        }
      });
    }
  
    function onResize() {
      initializeBoundingBoxes();
    }
  
    onMount(() => {
      window.addEventListener("resize", onResize);
      initializeBoundingBoxes();
      return () => window.removeEventListener("resize", onResize);
    });
  </script>
  
  <h1>Understanding Restrictive Covenants</h1>
  
  <div class="intro-wrapper">
    <h2>What are restrictive covenants?</h2>
    <p>
        A racially restrictive covenant is a legal clause inserted into a property deed prohibiting the sale, lease, and occupation of property to people of specific races, ethnicities, or religions. Although the record is mixed due to incomplete data and analog documents that were never digitized, restrictive covenants have been identified and documented across the country. According to the National Covenants Research Coalition, “​​Covenants come in a variety of forms. They could be plat restrictions, established by a real estate developer from the time a subdivision was laid out. They could be agreements, signed by residents in a neighborhood, never to sell, lease, or allow occupancy by someone who was not Caucasian, then filed with the county recorder of deeds. They could be private block restrictions on a small enclave within a city. They could be a short clause within a deed document, where the restriction or covenant language was embedded in every deed document when the property was transferred.”
    </p>
  
    <h2>Tracing the social construction of whiteness in Middlesex County</h2>
    <p>
        On this page, there are five deeds for homes within Middlesex County where researchers have identified the presence of restrictive covenants. Select the text within red box to read the language that was used within each of the deeds and note how the language changes between the first covenant (1878) and the final covenant (1950).
    </p>
  </div>



  {#if showAlert}
    <div
      class="modal-overlay"
      role="dialog"
      aria-modal="true"
      tabindex="0"
      on:click={closeAlert}
      on:keydown={(e) => e.key === "Escape" && closeAlert()}
    >
      <div class="modal" on:click|stopPropagation>
        <h2>{alertMessage}</h2>
        <button on:click={closeAlert}>OK</button>
      </div>
    </div>
  {/if}
  
  <div class="covenants-wrapper">
    {#each deeds as deed}
      <div class="deed">
        <button
          type="button"
          class="image-button"
          on:click={(e) => handleClick(e, deed)}
        >
          <img
            id={`image-${deed.id}`}
            src={deed.image}
            alt={deed.name}
          />
          <div id={`bounding-box-${deed.id}`}></div>
        </button>
        <div class="deed-text">
          <h2>{deed.name}</h2>
          <p>{deed.description}</p>
        </div>
      </div>
    {/each}
    <a class="explore-button" href="timeline">
        Take a walk through history!
    </a>
  </div>

    <!-- New back-to-top button -->
<button class="scroll-top" on:click={scrollToTop} aria-label="Back to top">
    ↑ Top
</button>
  
  <style>
    * {
      font-family: 'Courier', monospace;
    }
  
    h1 {
      text-align: center;
      color: white;
    }
  

    .covenants-wrapper {
      max-width: 900px;
      margin: 0 auto;
      padding: 1.5rem;
    }
  
    .deed {
      display: flex;
      flex-direction: row;
      gap: 2rem;
      margin: 2.5rem 0;
      padding: 1.5rem;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
  
    .image-button {
      all: unset;
      position: relative;
      display: block;
      flex: 0 0 60%;
      cursor: pointer;
    }
  
    .image-button img {
      display: block;
      width: 100%;
      height: auto;
    }
  

    .deed-text {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }
  
    .deed-text h2 {
      margin-top: 0;
      font-size: 1.3rem;
    }
  
    .deed-text p {
      font-size: 1.05rem;
      line-height: 1.6;
    }
  
    .modal-overlay {
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
  
    .modal {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      text-align: center;
      max-width: 350px;
      width: 90%;
    }
  
    .modal h2 {
      margin: 0 0 10px;
      font-size: 18px;
      color: white;
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

.intro-wrapper {
  max-width: 900px;
  margin: 0 auto;      
  padding: 0 2rem;      
}

.intro-wrapper h2 {
  margin: 2rem 0 1rem;  
}

.intro-wrapper p {
  margin: 0 0 1.5rem;   
}

.explore-button {
    display: inline-block;
    margin-top: 1rem;
    padding: 0.75rem 1.25rem;
    background: #b30000;
    color: #fff;
    text-decoration: none;
    border-radius: 4px;
    font-weight: bold;
  }
  .explore-button:hover {
    background: #b30000;
  }

  .scroll-top {
    position: fixed;
    right: 1.5rem;
    bottom: 1.5rem;
    background: #b30000;
    color: #fff;
    border: none;
    padding: 0.75rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    z-index: 500;
  }
  .scroll-top:hover {
    background: #b30000;
  }

  </style>
  