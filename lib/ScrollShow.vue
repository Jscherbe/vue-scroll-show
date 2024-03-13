<!-- 
  Notes:
    - The presentation is the sticky element 
      - invisible triggers below are what make up the space on page 
    - Triggers: Responsible only for taking up space and triggering
    the animations of the sticky slides above
      - Pull it under the full amount of the presentation
-->
<template>
  <div 
    class="scroll-show" 
    ref="container"
    :class="{ 'scroll-show--active' : active }"
  >
    <div 
      class="scroll-show__presentation" 
      ref="presentation"
      :style="{ height }"
    >
      <slot 
        :activeIndex="activeIndex" 
        :progress="progress"
        :scrollTo="scrollTo"
        :active="active"
        :scrollDirection="scrollDirection"
      />
    </div>
    <div 
      class="scroll-show__triggers" 
      ref="triggers"
      :style="{ marginTop: `-${ height }` }"
    >
      <div 
        class="scroll-show__trigger"
        v-for="trigger in triggers"
        :key="trigger.id"
        :style="{ height: trigger.height }"
        :id="trigger.id"
      ></div>
    </div>
  </div>
</template>

<script>
  import { computed } from "vue";
  import * as ScrollMagic from "scrollmagic";
  import { debounce } from "@ulu/utils/performance.js";
  import { ACTIVE_INDEX, TRIGGERS, SCROLLTO, PROGRESS } from "./symbols.js";
  let idCounter = 0;
  export default {
    name: "ScrollShow",
    props: {
      /**
       * The amount of scenes to create (since they are simulated)
       * - Future could support array (other prop different heights?)
       */
      scenes: {
        type: [Number, Array],
        required: true
      },
      /**
       * How long (in css units) a scene should be
       * - Optionally pass a function (given scene index)
       */
      sceneHeight: {
        type: [Function, String],
        default: "100dvh"
      },
      /**
       * Accepts the same options as sceneHeight but for setting 
       * the height of the presentation
       */
      height: {
        type: [Function, String],
        default: "200dvh"
      }
    },
    data() {
      return {
        progress: 0,
        progressTicking: false,
        activeIndex: 0,
        active: false, // Else it is after
        scrollDirection: null,
      };
    },
    provide() {
      return {
        [ACTIVE_INDEX]: computed(() => this.activeIndex),
        [PROGRESS]: computed(() => this.progress),
        [TRIGGERS]: computed(() => this.triggers),
        [SCROLLTO]: (index) => this.scrollTo(index)
      };
    },
    computed: {
      triggers() {
        const { scenes } = this;
        const array = typeof scenes === "number" ? { length: scenes } : scenes;
        return Array.from(array, (custom, index) => ({
          height: this.resolveHeight(custom ?? this.sceneHeight, index),
          scene: null,
          id: this.getId("t")
        }));
      },
    },
    methods: {
      getId(prefix) {
        return `ulu-vss-${ prefix }-${ ++idCounter }`;
      },
      resolveHeight(val, ...args) {
        const type = typeof val;
        if (type === "function") {
          return val(...args);
        } else if (type === "string") {
          return val;
        } else {
          throw Error("Unable to resolve height, expected string or function:", val);
        }
      },
      /**
       * Height of whole scene minus the presentation (so it completes by the time it unsticks)
       */
      getMainDuration() {
        const { triggers, presentation } = this.$refs;
        return triggers.clientHeight - presentation.clientHeight;
      },
      destroy() {
        // Destroy the scroll magic instance and the resize handler, 
        // in case this component is mounted again in the future
        this.controller.destroy(true);
      },
      // Navigated to another scene programmatically (dots use this)
      scrollTo(index) {
        // const title = document.getElementById(this.titleId(index));
        const trigger = this.triggers[index];
        if (trigger) {
          this.controller.scrollTo(document.getElementById(trigger.id));
          this.$emit("scrollTo", { index });
        }
      },
      resize() {
        // Update window height (causes properties for heights to recalculate)
        // this.triggers.forEach(trigger => trigger.updateHeight());
        this.mainScene.duration(this.getMainDuration());
        this.$emit("afterResize");
      },
      initialize() {
        const { container } = this.$refs;
        // Controller for the scenes (attached to window)
        this.controller = new ScrollMagic.Controller();
        // Attach scenes for each trigger element these will fire the animations
        // like keyframes between the scroll points
        this.triggerScenes = this.triggers.map((trigger, index) => {
          const triggerElement = document.getElementById(trigger.id);
          // Create a new scene for each trigger
          // the duration is set to the height of the trigger element
          // calculated above in computed property
          return new ScrollMagic
            .Scene({
              triggerElement,
              triggerHook: 0.5,
              duration: "100%"
            })
            .on("enter", () => {
              this.activeIndex = index;
              this.$emit("sceneChange", { index });
            })
            // Attach handler on scene enter to change the active slide
            .addTo(this.controller);
        });
        
        // Create the main scene, which holds the nested trigger scenes and the 
        // pinned container which holds the actual slide display
        this.mainScene = new ScrollMagic
          .Scene({
            triggerElement: container,
            triggerHook: 0, 
            duration: this.getMainDuration()
          })
          // This will pin the slide visual area and add it to the window controller
          .on("enter", ({ scrollDirection }) => {
            this.active = true;
            this.scrollDirection = scrollDirection;
            this.$emit("enter", { scrollDirection });
          })
          .on("start", ({ scrollDirection }) => {
            // Scene ended above
            if (scrollDirection === "REVERSE") {
              this.active = false;
              this.scrollDirection = scrollDirection;
              this.$emit("exit", { scrollDirection });
            }
          })
          .on("end", ({ state, scrollDirection }) => {
            // Below the scene
            if (state === "AFTER") {
              this.active = false;
              this.$emit("exit", { scrollDirection });
            }
          })
          .on("progress", (e) => {
            this.$emit("progress", e);
            if (!this.progressTicking) {
              window.requestAnimationFrame(() => {
                this.progress = e.progress;
                this.progressTicking = false;
              });
              this.progressTicking = true;
            }
          })
          .addTo(this.controller);

        this.$emit("initialized");
      },
      update() {
        this.destroy();
        this.$nextTick(() => {
          this.initialize();
        });
      },
    },
    watch: {
      scenes() {
        this.update();
      },
      sceneHeight() {
        this.update();
      },
      height() {
        this.update();
      }
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
    overflow: hidden;
  }
</style>