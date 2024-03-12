<template>
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

<script>
  export default {
    name: "SlideShow",
    props: ["activeIndex", "slides"]
  };
</script>