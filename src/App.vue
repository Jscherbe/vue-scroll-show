
<template>
  <div :style="spacerStyles">
    Before presentation
  </div>
  <CustomShow/>
  <div :style="spacerStyles">
    After presentation
  </div>
</template>

<script setup>
  import CustomShow from "./CustomShow.vue";
  const spacerStyles = "height: 200vh; background-color: black; color: white;";
</script>
