<template>
  <ScrollShow 
    class="custom-show" 
    :count="slides.length"
    sceneHeight="200vh"
    height="50vh"
  >
    <template #default="{ activeIndex }">

      <div class="custom-show__backgrounds">
        <template v-for="(slide, index) in slides" :key="index">
          <transition name="fade">
            <img v-show="activeIndex === index" :src="slide.image" alt="">
          </transition>
        </template>
      </div>

      <div class="custom-show__foregrounds">
        <template v-for="(slide, index) in slides" :key="index">
          <transition name="fade">
            <div 
              v-show="activeIndex === index" 
              class="custom-show__foreground"
            >
              {{ slide.text }}
            </div>
          </transition>
        </template>
      </div>

    </template>

    <template #nav="{ index }">
      <span class="hidden-visually">Goto part {{ index }}</span>
    </template>
  </ScrollShow>
</template>

<script setup>
  import ScrollShow from "../lib/ScrollShow.vue";
  import { slides } from "./slides.js";
</script>

<style lang="scss">
  .custom-show {
    .scroll-show__nav-button {
      background-color: gray;
      box-shadow: 0 0 10px rgba(0,0,0,0.4);
      border-radius: 50%;
      width: 2em;
      height: 2em;
      &.is-active {
        color: black;
      }
    }
    
  }
  .custom-show__backgrounds {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    img {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }
  .custom-show__foreground {
    position: absolute;
    z-index: 101;
    top: 50%;
    left: 20%;
    max-width: 80%;
    padding-right: 10rem;
    color: white;
    font-size: 30px;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>