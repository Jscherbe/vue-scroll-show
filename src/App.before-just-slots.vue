
<template>
  <div :style="spacerStyles">Before presentation
  </div>
  <ScrollShow>
    <template #default="{ activeIndex }">
      <div class="custom-backgrounds">
        <template v-for="(slide, index) in slides" :key="index">
          <img v-show="activeIndex === index" :src="slide.image" alt="">
        </template>
      </div>
      <ScrollShowSlide 
        v-for="(slide, index) in slides" 
        :key="index"
      >
        <div class="container">
          {{ slide.text }}
        </div>
      </ScrollShowSlide>
      
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

<style lang="scss">
  .custom-backgrounds {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
</style>
