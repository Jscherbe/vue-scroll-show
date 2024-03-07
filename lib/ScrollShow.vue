<template>
  <div 
    class="scroll-show" 
    ref="container"
    :class="{ 'scroll-show--active' : active }"
  >
    <!-- 
    The presentation is the sticky element 
    - invisible triggers below are what make up the space on page 
    - 
    -->
    <div class="scroll-show__presentation" ref="presentation">
      

      <slot 
        :activeIndex="activeIndex" 
        :progress="progress"
      />
    </div>
    <!-- 
      Triggers: Responsible only for taking up space and triggering
      the animations of the sticky slides above
     -->
     <div class="ScrollPoints__triggers" ref="triggers">
      <div 
        class="ScrollPoints__trigger"
        v-for="(trigger, index) in triggers"
        :key="index"
        :style="{
          height: `${ trigger.height }px`
        }"
        :ref="(el) => { trigger.element = el }"
      ></div>
    </div>
  </div>
</template>

<script>
  import { computed } from "vue";
  import * as ScrollMagic from "scrollmagic";
  import { debounce } from "@ulu/utils/performance.js";
  import { windowHeight } from "@ulu/utils/browser/dom.js";
  import { ACTIVE_INDEX, TRIGGERS, GOTO, PROGRESS } from "./symbols.js";
  
  export default {
    name: "ScrollShow",
    props: {
      /**
       * The amount of slide to create (since they are simulated)
       * - Future could support array (other prop different heights?)
       */
      count: {
        type: Number,
        required: true
      },
      /**
       * Incase the it's needed
       */
      navAriaLabel: {
        type: Function,
        default: (_index) => null
      },
      sceneHeight: {
        type: Function,
        default: () => windowHeight()
      },
      noNav: Boolean,
      noProgress: Boolean,
    },
    data() {
      return {
        progress: 0,
        progressTicking: false,
        activeIndex: 0,
        triggers: this.createTriggers(),
        active: false, // Else it is after
        scrollDirection: null,
      };
    },
    provide() {
      return {
        [ACTIVE_INDEX]: computed(() => this.activeIndex),
        [PROGRESS]: computed(() => this.progress),
        [TRIGGERS]: computed(() => this.triggers),
        [GOTO]: (index) => this.goto(index)
      };
    },
    methods: {
      createTriggers() {
        const { count } = this;
        return Array.from({ length: count }, (_, index) => {
          return {
            height: this.sceneHeight(index),
            scene: null,
            element: null
          };
        });
      },
      destroy() {
        // Destroy the scroll magic instance and the resize handler, 
        // in case this component is mounted again in the future
        this.controller.destroy(true);
      },
      update() {
        // what to do if slide is removed
        this.destroy();
        this.triggers = this.createTriggers();
        this.$nextTick(() => {
          this.initialize();
        });
      },
      // Navigated to another scene programmatically (dots use this)
      goto(index) {
        // const title = document.getElementById(this.titleId(index));
        this.controller.scrollTo(this.triggers[index].scene);
        this.$emit("sceneNavigation", index);
      },
      resize() {
        // Update window height (causes properties for heights to recalculate)
        this.triggers.forEach((trigger, index) => {
          trigger.height = this.sceneHeight(index);
        });
        this.mainScene.duration(this.$refs.container.clientHeight);
      },
      initialize() {
        const { container } = this.$refs;
        // Controller for the scenes (attached to window)
        this.controller = new ScrollMagic.Controller();
        // Attach scenes for each trigger element these will fire the animations
        // like keyframes between the scroll points
        this.triggers.forEach((trigger, index) => {
          const { element } = trigger;
          // Create a new scene for each trigger
          // the duration is set to the height of the trigger element
          // calculated above in computed property
          trigger.scene = new ScrollMagic
            .Scene({
              triggerElement: element,
              triggerHook: 0,
              duration: trigger.height
            })
            .on("enter", () => {
              this.activeIndex = index;
              this.$emit("sceneChange", index);
            })
            // Attach handler on scene enter to change the active slide
            .addTo(this.controller);

        });
        
        // Create the main scene, which holds the nested trigger scenes and the 
        // pinned container which holds the actual slide display
        this.mainScene = new ScrollMagic
          .Scene({
            triggerElement: container,
            // triggerHook: "onLeave", 
            duration: container.clientHeight
          })
          // This will pin the slide visual area and add it to the window controller
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
      this.$nextTick(() => this.initialize());
      // Add resize handler to update the values when the screen size changes
      this.reziseHandler = debounce(this.resize, 500, false, this);
      window.addEventListener("resize", this.reziseHandler);
    },
    beforeUnmount() {
      this.destroy();
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
  
  
</style>