<template>
  <div 
    class="scroll-show" 
    ref="container"
    :class="{ 'scroll-show--active' : active }"
  >
    <!-- 
    The presentation is the sticky element 
    - invisible triggers below are what make up the space on page 
    -->
    <div 
      class="scroll-show__presentation" 
      ref="presentation"
      :style="{ height: toPx(resolvedHeight) }"
    >
      <slot 
        :activeIndex="activeIndex" 
        :progress="progress"
      />
    </div>
    <!-- 
      Triggers: Responsible only for taking up space and triggering
      the animations of the sticky slides above
      - Pull it under the full amount of the presentation

        paddingBottom: toPx(presentationHeight)
     -->
     <div 
      class="scroll-show__triggers" 
      ref="triggers"
      :style="{ 
        marginTop: `-${ toPx(resolvedHeight) }`,
      }"
    >
      <div 
        class="scroll-show__trigger"
        v-for="(trigger, index) in triggers"
        :key="index"
        :style="{ height: toPx(trigger.height) }"
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
  import { separateCssUnit } from "@ulu/utils/string.js";
  import { ACTIVE_INDEX, TRIGGERS, GOTO, PROGRESS } from "./symbols.js";
  
  export default {
    name: "ScrollShow",
    props: {
      /**
       * The amount of slide to create (since they are simulated)
       * - Future could support array (other prop different heights?)
       */
      scenes: {
        type: [Number, Array],
        required: true
      },
      /**
       * How long (in unitless pixels) a scene should be
       * - Optionally pass a function (given scene index)
       * - Or pass a string that uses [px, %, vh] 
       *   (with percentages being based on windowHeight)
       */
      sceneHeight: {
        type: [Function, String, Number],
        default: () => windowHeight()
      },
      /**
       * Accepts the same options as sceneHeight but for setting 
       * the height of the presentation
       */
      height: {
        type: [Function, String, Number],
        default: () => windowHeight()
      }
    },
    data() {
      return {
        progress: 0,
        progressTicking: false,
        activeIndex: 0,
        triggers: this.createTriggers(),
        active: false, // Else it is after
        scrollDirection: null,
        resolvedHeight: this.resolveHeight(this.height)
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
    computed: {
      totalHeight() {
        const { triggers } = this;
        return triggers.reduce((total, t) => total + t.height, 0);
      },
      duration() {
        const { totalHeight, resolvedHeight } = this;
        // Removing the height of the screen so the screen can end when the main
        // scene starts scrolling up (ending one totalHeight early)
        // This makes the progress = to the length of the sticky scene instead of 
        // based just on when it enters / exits the viewport (ends up with scrolling progress)
        return totalHeight - resolvedHeight;
      }
    },
    methods: {
      resolveHeight(val, ...args) {
        const type = typeof val;
        if (type === "function") {
          return val(...args);
        } else if (type === "number") {
          return val;
        } else if (type === "string") {
          return this.resolveCssUnit(val);
        } else {
          throw Error("Unable to resolve height, expected string, number or function:", val);
        }
      },
      resolveCssUnit(val) {
        const { unit, value } = separateCssUnit(val);
        const isPerc = ["vh", "%"].includes(unit);
        if (isPerc) {
          return windowHeight() * (value / 100);
        } else {
          return value;
        }
      },
      toPx(number) {
        return number + "px";
      },
      createTriggers() {
        const { scenes, resolveHeight, sceneHeight } = this;
        const array = typeof scenes === "number" ? { length: scenes } : scenes;
        return Array.from(array, (custom, index) => {
          const trigger = {
            height: 0,
            scene: null,
            element: null
          };
          const updateHeight = () => {
            trigger.height = resolveHeight(custom ?? sceneHeight, index);
          };
          trigger.updateHeight = updateHeight;
          trigger.updateHeight();
          return trigger;
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
        this.resolvedHeight = this.resolveHeight(this.height);
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
        this.triggers.forEach(trigger => trigger.updateHeight());
        this.mainScene.duration(this.duration);
      },
      initialize() {
        const { duration } = this;
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
              triggerHook: 0.5,
              duration: trigger.height
            })
            .on("enter", () => {
              this.activeIndex = index;
              this.$emit("sceneChange", index);
            })
            // Attach handler on scene enter to change the active slide
            .addTo(this.controller);

        });

        // console.log("this.totalHeight:\n", this.totalHeight);
        // console.log("container.clientHeight:\n", container.clientHeight);
        
        // Create the main scene, which holds the nested trigger scenes and the 
        // pinned container which holds the actual slide display
        this.mainScene = new ScrollMagic
          .Scene({
            triggerElement: container,
            triggerHook: 0, 
            duration
          })
          // This will pin the slide visual area and add it to the window controller
          .on("enter", ({ scrollDirection }) => {
            this.active = true;
            this.scrollDirection = scrollDirection;
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
    overflow: hidden;
    // opacity: 0;
  }
  
</style>