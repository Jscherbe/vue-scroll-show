
<template>
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
</template>

<script setup>
  import ScrollShow from "../lib/ScrollShow.vue";
  import ScrollShowSlide from "../lib/ScrollShowSlide.vue";

  import { slides } from "./slides.js";
</script>
