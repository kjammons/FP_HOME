<script>
    import { onMount } from "svelte";
    import * as pdfjsLib from "pdfjs-dist";
  
    // ✅ Use safe fallback to avoid worker issues
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.1.91/pdf.worker.min.js";
  
    let canvasEl;
    let svgContainer;
    let containerEl;
  
    const pdfFile = "/map.pdf";
    const svgFile = "/overlay.svg";
  
    const renderOverlay = async () => {
      console.log("Starting render");
  
      const loadingTask = pdfjsLib.getDocument(pdfFile);
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);
      console.log("PDF page loaded");
  
      const baseViewport = page.getViewport({ scale: 1 });
      const scale = containerEl.clientWidth / baseViewport.width;
      const viewport = page.getViewport({ scale });
  
      canvasEl.width = viewport.width;
      canvasEl.height = viewport.height;
  
      const context = canvasEl.getContext("2d");
      await page.render({ canvasContext: context, viewport }).promise;
      console.log("PDF rendered");
  
      // SVG
      const response = await fetch(svgFile);
      const svgText = await response.text();
      svgContainer.innerHTML = svgText;
  
      const svg = svgContainer.querySelector("svg");
      svg.setAttribute("width", viewport.width);
      svg.setAttribute("height", viewport.height);
      svg.style.position = "absolute";
      svg.style.top = "0";
      svg.style.left = "0";
      console.log("SVG rendered");
    };
  
    onMount(() => {
      setTimeout(() => renderOverlay(), 50); // slight delay
      window.addEventListener("resize", renderOverlay);
      return () => window.removeEventListener("resize", renderOverlay);
    });
  </script>
  
  <div class="overlay-wrapper" bind:this={containerEl}>
    <canvas bind:this={canvasEl}></canvas>
    <div class="svg-layer" bind:this={svgContainer}></div>
  </div>
  
  <style>
    .overlay-wrapper {
      position: relative;
      width: 100vw;
      height: 100vh;
      background: #f8f8f8;
      overflow: hidden;
    }
  
    canvas {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      background: #eaeaea;
    }
  
    .svg-layer {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 2;
      pointer-events: none;
      background: rgba(0, 255, 0, 0.05); /* light green for debug */
    }
  
    .svg-layer svg {
      width: 100%;
      height: 100%;
    }
  </style>
  