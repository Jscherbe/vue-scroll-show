
<template>
  <AppSpacer>
    Before Presentation
  </AppSpacer>

  <ScrollShow 
    class="custom-show" 
    :scenes="slides.length"
    sceneHeight="200vh"
    height="100vh"
    v-slot="{ activeIndex }"
  >
    <ScrollShowNav/>
    <SlideShow :slides="slides" :activeIndex="activeIndex"/>
    <ScrollShowProgress/>
  </ScrollShow>

  <AppSpacer>
    With Different Heights
  </AppSpacer>

  <ScrollShow 
    class="custom-show" 
    :scenes="slides.map(s => s.height)"
    height="100vh"
    v-slot="{ activeIndex }"
  >
    <ScrollShowNav/>
    <SlideShow :slides="slides" :activeIndex="activeIndex"/>
    <ScrollShowProgress/>
  </ScrollShow>

  <AppSpacer>
    After presentation
  </AppSpacer>
</template>

<script setup>
  import ScrollShow from "../lib/ScrollShow.vue";
  import ScrollShowNav from "../lib/ScrollShowNav.vue";
  import ScrollShowProgress from "../lib/ScrollShowProgress.vue";
  import SlideShow from "./SlideShow.vue";
  import AppSpacer from "./AppSpacer.vue";
  import { slides } from "./slides.js";
</script>

<style lang="scss">
  .custom-show {
    .scroll-show__nav {
      position: absolute;
      z-index: 100;
      width: auto;
      top: 50%;
      transform: translateY(-50%);
      right: 2rem;
    }
    .scroll-show__nav-button {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .scroll-show__nav-button {
      background-color: white;
      color: rgb(67, 67, 67);
      box-shadow: 0 0 10px rgba(0,0,0,0.4);
      border-radius: 50%;
      width: 2em;
      height: 2em;
      margin: 0.5em 0;
      transition: background-color 200ms;
      &.is-active {
        background-color: rgb(212, 167, 32);
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
