<template>
  <div 
    class="scroll-show" 
    ref="container"
    :class="{ 'scroll-show--active' : active }"
  >
    
    <div class="scroll-show__presentation" ref="presentation">
      <ScrollShowNav v-if="!noNav" :slides="slides" :gotoScene="gotoScene"/>
      <component :is="element" class="scroll-show__slides">
        <slot 
          :activeIndex="activeIndex" 
          :progress="progress"
        />
      </component>
      <ScrollShowProgress v-if="!noProgress" :progress="progress"/>
    </div>
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
        :ref="(el) => {slide.triggerElement = el;}"
      ></div>
    </div>
  </div>
</template>

<script>
  import * as ScrollMagic from "scrollmagic";
  import ScrollShowNav from "./ScrollShowNav.vue";
  import ScrollShowProgress from "./ScrollShowProgress.vue";
  import { debounce } from "@ulu/utils/performance.js";
  import { windowHeight } from "@ulu/utils/browser/dom.js";
  import { computed } from "vue";
  import { SECTIONS, REGISTER, UNREGISTER } from "./symbols.js";
  export default {
    name: "ScrollShow",
    components: {
      ScrollShowNav,
      ScrollShowProgress
    },
    props: {
      /**
       * The amount of slide to create (since they are simulated)
       */
      count: {
        type: Number,
        required: true
      },
      /**
       * Change the element that wraps the slides (ie. ul, ol, etc)
       */
      element: {
        type: String,
        default: "div"
      },
      getSlideHeight: {
        type: Function,
        default: windowHeight => windowHeight
      },
      duration: {
        type: Number,
        default: 100
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
            triggerElement: null,
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
        // Cached window height
        windowHeight: windowHeight(),
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
      slideHeight() {
        return this.getSlideHeight(this.windowHeight);
      },
      sceneHeight() {
        return Math.floor(this.slideHeight * this.slides.length);
      },
      triggerHeight() {
        // Rounding all heights down to make sure they don't exceed the sceneHeight
        // The difference will be added to the last slide in triggerHeights()
        return Math.floor((this.sceneHeight - this.slideHeight) / (this.slides.length - 1));
      },
      // The calculated height for the elements the user is actually scrolling, 
      // which trigger the animations between slides
      triggerHeights() { 
        let total = 0;
        return this.slides.map((_, index) => {
          // First and last scenes are static height the others 
          // are calculated portion of total height of the scene. 
          let duration = index === 0 ? this.slideHeight : this.triggerHeight;
          // Collect total so that we can add any difference (from rounding) to the last slide.
          // Ensuring all of the heights are exactly equal to the scene height.
          total += duration;
          // Add difference to last slide so heights are exactly equal to sceneHeight
          if (index === this.slides.length - 1) {
            duration += this.sceneHeight - total;
          }
          return duration;
        });
      }
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
        // Update window height (causes properties for heights to recalculate)
        this.windowHeight = windowHeight();
        // Update Scene Durations
        this.triggerScenes.forEach((scene, index) => scene.duration(this.triggerHeights[index]));
        this.mainScene.duration(this.sceneHeight);
      },
      setActive(index) {
        this.activeIndex = index;
        this.slides.forEach((slide, index) => slide.active = index === index);
      },
      init() {
        const { slides } = this;
        const { container } = this.$refs;
        // Controller for the scenes (attached to window)
        this.controller = new ScrollMagic.Controller();
        // Attach scenes for each trigger element these will fire the animations
        // like keyframes between the scroll points
        this.triggerScenes = slides.map((slide, index) => {
          const { triggerElement } = slide;
          // Create a new scene for each trigger
          // the duration is set to the height of the trigger element
          // calculated above in computed property
          const scene = new ScrollMagic.Scene({
            triggerElement: triggerElement,
            triggerHook: 0,
            duration: this.triggerHeights[index]
          });
          // Attach handler on scene enter to change the active slide
          scene.on("enter", () => this.setActive(index)).addTo(this.controller);
          return scene;
        });
        // Create the main scene, which holds the nested trigger scenes and the 
        // pinned container which holds the actual slide display
        this.mainScene = new ScrollMagic.Scene({
          triggerElement: container,
          // triggerHook: "onLeave", 
          duration: this.sceneHeight
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
            console.log(e.progress);
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
      this.$nextTick(() => this.init());
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
    top: 0px;
    height: 100vh;
  }
  .scroll-show__triggers {
    opacity: 0;
    visibility: hidden;
    // Pull it under the full amount of the presentation
    margin-top: -100vh; 
    // Additional padding on bottom when using the 
    // sticky method increases last slide duration
    // before it disengages
    padding-bottom: 100vh;
  }
  .scroll-show__slide {
    position: absolute;
    top: 50%;
    left: 20%;
  }
</style>