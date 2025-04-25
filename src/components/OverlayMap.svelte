<script>
  import { onMount } from "svelte";
  import * as pdfjsLib from "pdfjs";
  
  // ✅ Point to the local worker file manually
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

  let canvasEl;
  let svgContainer;

  onMount(async () => {
    console.log("🧭 OverlayMap mounted");
    try {
      const loadingTask = pdfjsLib.getDocument("./map.pdf");
      console.log("📥 loading map.pdf...");
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 0.7 });
      console.log("📐 PDF width x height:", viewport.width, "x", viewport.height);

      const context = canvasEl.getContext("2d");
      canvasEl.width = viewport.width;
      canvasEl.height = viewport.height;

      await page.render({ canvasContext: context, viewport }).promise;

      // Load and insert the SVG
      const response = await fetch("/overlay.svg");
      const svgText = await response.text();
      svgContainer.innerHTML = svgText;

      const svg = svgContainer.querySelector("svg");

      // Match dimensions
      svg.setAttribute("width", 1498.224);
      svg.setAttribute("height", 742.56);
      svg.setAttribute("viewBox", "0 0 1498.224 742.56");
      svg.style.position = "absolute";
      svg.style.top = "0";
      svg.style.left = "0";

      console.log("✅ PDF rendered");
    } catch (err) {
      console.error("🚨 PDF render error:", err);
    }
  });
</script>

<div class="pdf-svg-container">
  <canvas bind:this={canvasEl}></canvas>
  <div class="svg-overlay" bind:this={svgContainer}></div>
</div>

<style>
  .pdf-svg-container {
    position: relative;
    width: 1498.224px;
    height: 742.56px;
    margin: auto;
    background: lightgray;
  }

  canvas, .svg-overlay {
    position: absolute;
    top: 0;
    left: 0;
  }

  .svg-overlay svg {
    width: 1498.224px;
    height: 742.56px;
  }
</style>