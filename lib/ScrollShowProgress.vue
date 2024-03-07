<template>
  <div class="scroll-show__progress">
    <div 
      class="scroll-show__progress-bar" 
      :style="{ transform : `scaleX(${ progress })` }"
    ></div>
  </div>
</template>

<script>
  import { PROGRESS } from "./symbols.js";
  export default {
    name: "ScrollShowProgress",
    inject: {
      progress: { from: PROGRESS },
    }
  };
</script>

<style lang="scss">
  .scroll-show__progress {
    position: absolute;
    z-index: 100;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.4);
  }
  .scroll-show__progress-bar {
    background-color: rgba(255, 255, 255, 0.6);
    height: 4px;
    transform-origin: left center;
  }
</style>