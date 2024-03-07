
<template>
  <div :style="spacerStyles">Before presentation</div>
  <ScrollShow>
    <template #default>
      <ScrollShowSlide 
        v-for="(slide, index) in slides" 
        :key="index"
      >
        <div class="container">
          {{ slide.text }}
        </div>
      </ScrollShowSlide>
    </template>
    <template #background>
      <img 
        v-for="(slide, index) in slides" 
        :key="index"
        :src="slide.image"
        alt=""
      >
    </template>
  </ScrollShow>
  <div :style="spacerStyles">After presentation</div>
</template>

<script setup>
  import ScrollShow from "../lib/ScrollShow.vue";
  import ScrollShowSlide from "../lib/ScrollShowSlide.vue";

  import { slides } from "./slides.js";
  const spacerStyles = "height: 200vh; background-color: black; color: white;";
</script>
