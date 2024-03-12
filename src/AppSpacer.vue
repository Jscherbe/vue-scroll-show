<template>
  <div class="app-spacer">
    <slot/>
  </div>
</template>

<script>
  export default {
    name: "AppSpacer",
  };
</script>

<style lang="scss">
  .app-spacer {
    height: 150vh; 
    background-color: black; 
    color: white;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    font-size: larger;
    font-weight: bold;
    padding-top: 50vh;
  }
</style>