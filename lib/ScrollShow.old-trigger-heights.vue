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
     <!-- <div class="ScrollPoints__triggers">
      <div 
        class="ScrollPoints__trigger"
        v-for="(slide, index) in slides"
        :key="index"
        :style="{
          height: `${ triggerHeights[index] }px`
        }"
        ref="triggers"
      ></div>
    </div> -->
  </div>
</template>

<script>
  import * as ScrollMagic from "scrollmagic";
  import { windowHeight } from "@ulu/utils/browser/dom.js";
  import { debounce } from "@ulu/utils/performance.js";
  import { computed, markRaw } from "vue";
  import { SECTIONS, REGISTER, UNREGISTER } from "./symbols.js";
  export default {
    name: "ScrollShow",
    props: {
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
      }
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
        slideHeight: this.getSlideHeight(windowHeight()),
        supportsPositionSticky: browserWithPositionSticky(),
        // Cached window height
        windowHeight: windowHeight(),
        // Property that is used to change the scale of the progress bar
        progress: 0,
        // Flag for requestAnimationFrame to throttle progress state update
        progressTicking: false,
        
        // Index of the slide that is currently active
        activeIndex: 0,
        // Flag to store whether the user is below the slide show
        afterScene: false,
        // References
        triggerScenes: [],
        mainScene: null,
        reziseHandler: null,
        sceneStarted: false,
        withinScene: false, // Else it is after
      };
    },
    computed: {
      length() {
        return this.slides.length;
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
      },
      // State changes when the user is withing the main scene,
      // which contains the entire slide show
      withinMainScene(within) {
        this.withinScene = within;
      },
      // Navigated to another scene programmatically (dots use this)
      gotoScene(index) {
        const title = document.getElementById(this.titleId(index));
        this.controller.scrollTo(this.triggerScenes[index]);
        title.focus();
      },
      titleId(index) {
        return `slide-title--${ index }`;
      },
      onResize() {
        // Update window height (causes properties for heights to recalculate)
        this.windowHeight = windowHeight();
        // Update Scene Durations
        this.triggerScenes.forEach((scene, index) => scene.duration(this.triggerHeights[index]));
        this.mainScene.duration(this.sceneHeight);
      },
      onProgress(progress) {
        if (!this.progressTicking) {
          window.requestAnimationFrame(() => {
            this.progress = progress;
            this.progressTicking = false;
          });
          this.progressTicking = true;
        }
      },
      init() {
        const { slides } = this;
        const { wrap, presentation } = this.$refs;
        // Controller for the scenes (attached to window)
        this.controller = new ScrollMagic.Controller();
        // Attach scenes for each trigger element these will fire the animations
        // like keyframes between the scroll points
        this.triggerScenes = slides.map((slide, index) => {
          const triggerElement = slide.element;
          // Create a new scene for each trigger
          // the duration is set to the height of the trigger element
          // calculated above in computed property
          console.log("this.triggerHeights[index]:\n", this.triggerHeights[index]);
          console.log("triggerElement.clientHeight:\n", triggerElement.clientHeight);
          const scene = new ScrollMagic.Scene({
            triggerElement,
            triggerHook: 0,
            duration: this.triggerHeights[index]
          });
          // Attach handler on scene enter to change the active slide
          scene.on("enter", () => this.activeIndex = index).addTo(this.controller);
          return scene;
        });
        // Create the main scene, which holds the nested trigger scenes and the 
        // pinned container which holds the actual slide display
        this.mainScene = new ScrollMagic.Scene({
          triggerElement: wrap,
          triggerHook: "onLeave", 
          duration: this.sceneHeight
        });
        // This will pin the slide visual area and add it to the window controller
        this.mainScene
          // .setPin(presentation)
          .on("progress", (e) => this.onProgress(e.progress))
          .on("end", ({ state }) => this.withinMainScene(state === "DURING"))
          .addTo(this.controller);

        // Use pin for legacy users
        if (!this.supportsPositionSticky) {
          this.mainScene.setPin(presentation);
        }
        // Add resize handler to update the values when the screen size changes
        this.reziseHandler = debounce(this.onResize, 500, false, this);
        window.addEventListener("resize", this.reziseHandler);
      },
      destroy() {
        // Destroy the scroll magic instance and the resize handler, in case this 
        // component is mounted again in the future
        this.controller.destroy(true);
        window.removeEventListener("resize", this.reziseHandler);
      }
    },
    mounted() {
      this.init();
    },
    beforeUnmount() {
      this.destroy();
    }
  };

  /**
   *   Check browser support for position: sticky
   *   - https://stackoverflow.com/questions/60214332/dynamically-detect-if-positionsticky-is-supported-by-the-browser
   *   @return {Boolean}
   */
  function browserWithPositionSticky() {
    var prop = "position:";
    var value = "sticky";
    var prefixes = " -webkit- -moz- -o- -ms- ".split(" ");
    var el = document.createElement("a");
    var mStyle = el.style;
    mStyle.cssText = prop + prefixes.join(value + ";" + prop).slice(0, - prop.length);
    return mStyle.position.indexOf(value) !== -1;
  }
</script>