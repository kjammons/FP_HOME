<!-- src/components/TextBox.svelte -->
<script>
    
    export let text = "This map displays various municipalities along with their homeownership rates. Hover over a municipality for details.";
  </script>
  
  <div class="text-box">
    {text}
  </div>
  
  <style>
    .text-box {
      padding: 10px;
      background-color: #f8f8f8;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 1rem;
      color: #333;
      margin-top: 20px;
    }
  </style>
  