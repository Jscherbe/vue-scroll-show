<template>
  <div 
    class="scroll-show" 
    ref="wrap"
    :class="{
      'scroll-show--active' : active
    }"
  >
    <ScrollShowNav v-if="!noNav" :slides="slides" :gotoScene="gotoScene"/>
    <div class="scroll-show__presentation" ref="presentation">
      <slot 
        :activeIndex="activeIndex" 
        :progress="progress"
      />
    </div>
    <div v-if="!noProgress" class="scroll-show__progress">
      <div class="scroll-show__progress-bar" :style="{ transform : `scaleX(${ progress })` }"></div>
    </div>
  </div>
</template>

<script>
  import * as ScrollMagic from "scrollmagic";
  import ScrollShowNav from "./ScrollShowNav.vue";
  import { debounce } from "@ulu/utils/performance.js";
  import { computed } from "vue";
  import { SECTIONS, REGISTER, UNREGISTER } from "./symbols.js";
  export default {
    name: "ScrollShow",
    components: {
      ScrollShowNav
    },
    props: {
      element: {
        type: String,
        default: "div"
      },
      noNav: Boolean,
      noProgress: Boolean,
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
    data() {
      return {
        slides: [],
        // Property that is used to change the scale of the progress bar
        progress: 0,
        // Flag for requestAnimationFrame to throttle progress state update
        progressTicking: false,
        // Index of the slide that is currently active
        activeIndex: 0,
        // Flag to store whether the user is below the slide show
        
        // References
        triggerScenes: [],
        mainScene: null,
        reziseHandler: null,
        active: false, // Else it is after
        scrollDirection: null,
      };
    },
    computed: {
      length() {
        return this.slides.length;
      },
      sceneHeight() {
        return Math.floor(this.slideHeight * this.slides.length);
      },
    },
    methods: {
      update() {
        // what to do if slide is removed
        this.triggerScenes = [];
        this.controller.destroy(true);
        this.init();
      },
      // Navigated to another scene programmatically (dots use this)
      gotoScene(index) {
        // const title = document.getElementById(this.titleId(index));
        this.controller.scrollTo(this.triggerScenes[index]);
        this.$emit("onGotoScene", index);
      },
      getSlideDuration(el) {
        return el.clientHeight;
      },
      getSceneDuration() {
        return this.slides.reduce((acc, slide) => acc + this.getSlideDuration(slide.element), 0);
      },
      onResize() {
        this.triggerScenes.forEach((scene, index) => {
          scene.duration(this.getSlideDuration(this.slides[index]));
        });
        this.mainScene.duration(this.getSceneDuration());
      },
      setActive(index) {
        this.activeIndex = index;
        this.slides.forEach((slide, index) => slide.active = index === index);
      },
      init() {
        const { slides } = this;
        const { wrap } = this.$refs;
        // Controller for the scenes (attached to window)
        this.controller = new ScrollMagic.Controller();
        // Attach scenes for each trigger element these will fire the animations
        // like keyframes between the scroll points
        this.triggerScenes = slides.map((slide, index) => {
          const { element } = slide;
          // Create a new scene for each trigger
          // the duration is set to the height of the trigger element
          // calculated above in computed property
          const scene = new ScrollMagic.Scene({
            triggerElement: element,
            triggerHook: 0,
            duration: this.getSlideDuration(element)
          });
          // Attach handler on scene enter to change the active slide
          scene.on("enter", () => this.setActive(index)).addTo(this.controller);
          return scene;
        });
        // Create the main scene, which holds the nested trigger scenes and the 
        // pinned container which holds the actual slide display
        this.mainScene = new ScrollMagic.Scene({
          triggerElement: wrap,
          triggerHook: "onLeave", 
          duration: this.getSceneDuration()
        });
        // This will pin the slide visual area and add it to the window controller
        this.mainScene
          .on("enter", ({ scrollDirection }) => {
            this.active = true;
            this.scrollDirection = scrollDirection;
            // this.after = true;
          })
          .on("start", ({ scrollDirection }) => {
            // Scene ended above
            if (scrollDirection === "REVERSE") {
              this.active = false;
              this.scrollDirection = scrollDirection;
            }
          })
          .on("end", ({ state }) => {
            // Below the scene
            if (state === "AFTER") {
              this.active = false;
            }
          })
          .on("progress", (e) => {
            if (!this.progressTicking) {
              window.requestAnimationFrame(() => {
                this.progress = e.progress;
                this.progressTicking = false;
              });
              this.progressTicking = true;
            }
          })
          .addTo(this.controller);

      },
    },
    mounted() {
      this.init();
      // Add resize handler to update the values when the screen size changes
      this.reziseHandler = debounce(this.onResize, 500, false, this);
      window.addEventListener("resize", this.reziseHandler);
    },
    beforeUnmount() {
      // Destroy the scroll magic instance and the resize handler, in case this 
      // component is mounted again in the future
      this.controller.destroy(true);
      window.removeEventListener("resize", this.reziseHandler);
    }
  };
</script>

<style lang="scss">
  // The part that remains stuck (the canvas)
  .scroll-show__presentation {
    position: sticky;
  }
  
</style>