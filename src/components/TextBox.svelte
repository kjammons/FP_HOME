<!-- src/components/TextBox.svelte -->
<script>

    export let text = "Emilia to add descriptive content";
  </script>

  <div class="text-box">
    {text}
  </div>

  <style>

    div{
        font-family: 'Segoe UI', 'Helvetica Neue', sans-serif;
        font-size: 70%;
      }

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
