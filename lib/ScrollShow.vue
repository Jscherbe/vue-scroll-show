<template>
  <div class="scroll-show" ref="wrap">
    <div class="ScrollPoints__presentation" ref="presentation">
      <slot/>
    </div>
    <!-- 
      Triggers: Responsible only for taking up space and triggering
      the animations of the sticky slides above
     -->
    <!-- 
      Triggers: Responsible only for taking up space and triggering
      the animations of the sticky slides above
     -->
     <div class="ScrollPoints__triggers">
      <div 
        class="ScrollPoints__trigger"
        v-for="(slide, index) in slides"
        :key="index"
        :style="{
          height: `${ triggerHeights[index] }px`
        }"
        ref="triggers"
      ></div>
    </div>
  </div>
</template>

<script>
  import { computed } from "vue";
  import { SECTIONS, REGISTER, UNREGISTER } from "./symbols.js";
  export default {
    name: "ScrollShow",
    props: {
      element: {
        type: String,
        default: "div"
      },
    },
    data() {
      return {
        slides: []
      };
    },
    provide() {
      return {
        [SECTIONS]: computed(() => this.slides),
        [REGISTER]: (instance) => {
          const { element } = instance.$refs;
          this.slides.push({ 
            instance, 
            element,
            active: false 
          });
        },
        [UNREGISTER]: (instance) => {
          const slides = this.slides;
          const index = slides.findIndex(r => r.instance === instance);
          if (index > -1) {
            slides.splice(index, 1);
          }
          this.update();
        },
      };
    },
    methods: {
      update() {
        // Do stuff when a slide is removed
      }
    }
  };
</script>