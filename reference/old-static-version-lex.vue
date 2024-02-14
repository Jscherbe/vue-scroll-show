<template>
  <div 
    class="ScrollPoints dark-background" 
    :class="{ 
      'ScrollPoints--no-position-sticky' : !supportsPositionSticky,
      'ScrollPoints--use-position-sticky' : supportsPositionSticky 
    }"
    ref="wrap" 
  >
    <!-- 
      SLIDES:
      - Actual presentation the user sees
      - Stays fixed so that images and text can fade-in out
      - Decided to print out all content and backgrounds vs updating state and changing 
        * SEO
        * Image preload naturally
        * Greater ability for complex animations between
      - Each type if broken into containers for clarity only (ie. backgrounds, slides)
      - Masks are used in between backgrounds and slide content to make sure import 
        things stay visible on top of image
     -->
    <div class="ScrollPoints__presentation" ref="presentation">
      <div class="ScrollPoints__backgrounds">
        <div 
          class="ScrollPoints__background"
          v-for="(slide, index) in slides"
          :key="`b-${ index }`"
          :class="{ 'ScrollPoints__background--active' : index === activeIndex }"
          v-background-image-url="images[index]"
        ></div>
      </div>
      <div class="ScrollPoints__slides">
        <div 
          class="ScrollPoints__slide"
          v-for="(slide, index) in slides"
          :key="`slide-${ index }`"
          :class="[
            { 'ScrollPoints__slide--active' : index === activeIndex },
            `ScrollPoints__slide--layout-${ slide.layout }`
          ]"
        >
          <div class="ScrollPoints__slide-content">
            <!-- User's focus goes here after choosing from the dot-nav -->
            <h2 class="ScrollPoints__slide-title" :id="titleId(index)" tabindex="-1">
              {{ slide.title }}
            </h2>
            <div class="ScrollPoints__slide-body type-intro" :class="`type-intro--${ slide.layout }`" v-html="slide.body">
            </div>
          </div>
        </div>
      </div>
      <transition name="transition-fade">
        <div class="ScrollPoints__controls" v-if="!afterScene">
          <div class="ScrollPoints__nav" aria-hidden="true">
            <button 
              class="ScrollPoints__nav-dot" 
              v-for="(slide, index) in slides" 
              :key="`d-${ index }`"
              :class="{ 'ScrollPoints__nav-dot--active' : index === activeIndex }"
              @click="gotoScene(index)"
            ></button>
          </div>
          <button class="ScrollPoints__exit-button button button--stroked" v-scroll-to="exitOptions">
            How it Works
            <i class="button__icon-right fas fa-arrow-down"></i>
          </button>
          <div class="ScrollPoints__progress">
            <div class="ScrollPoints__progress-bar" :style="{ transform : `scaleX(${ progress })` }"></div>
          </div>
        </div>
      </transition>
    </div>
    <!-- 
      Triggers: Responsible only for taking up space and triggering
      the animations of the sticky slides above
     -->
     <div class="ScrollPoints__triggers">
      <div 
        class="ScrollPoints__trigger"
        v-for="(slide, index) in slides"
        :key="`t-${ index }`"
        :style="{
          height: `${ triggerHeights[index] }px`
        }"
        ref="triggers"
      ></div>
    </div>
  </div>
</template>

<script>
  import * as ScrollMagic from "scrollmagic";
  import { mapState } from "vuex";
  import { windowHeight, debounce, browserWithPositionSticky } from "@Library/js/utils.js";

  

  export default {
    name: 'ScrollPoints',
    data() {
      return {
        images: [
          require(`@Images/home/homepage-slideshow-1.jpg`),
          require(`@Images/home/homepage-slideshow-2.jpg`),
          require(`@Images/home/homepage-slideshow-3.jpg`),
          require(`@Images/home/homepage-slideshow-4.jpg`)
        ],
        supportsPositionSticky: browserWithPositionSticky(),
        // Options for the exit scroll button
        exitOptions: { 
          el: '#below-fold', 
          duration: 2000,
          // onStart: () => {
          //   this.presentationHidden = true;
          // },
          // onDone: () => {
          //   this.presentationHidden = false;
          // }
        },
        presentationHidden: false,
        // Cached window height
        windowHeight: windowHeight(),
        // Property that is used to change the scale of the progress bar
        progress: 0,
        // Flag for requestAnimationFrame to throttle progress state update
        progressTicking: false,
        // Controller for the scenes (attached to window)
        controller: new ScrollMagic.Controller(),
        // Index of the slide that is currently active
        activeIndex: 0,
        // Flag to store whether the user is below the slide show
        afterScene: false,
        // References
        triggerScenes: [],
        mainScene: null,
        reziseHandler: null
      };
    },
    computed: {
      ...mapState('content', ['slides']),
      durationFirst() {
        return this.$store.state.content.home['Slide-Duration-First'].value;
      },
      durationMultiplier() {
        return this.$store.state.content.home['Slide-Duration-Multiplier'].value;
      },
      length() {
        return this.slides.length;
      },
      sceneHeight() {
        return Math.floor(this.windowHeight * this.durationMultiplier);
      },
      triggerHeight() {
        // Rounding all heights down to make sure they don't exceed the sceneHeight
        // The difference will be added to the last slide in triggerHeights()
        return Math.floor((this.sceneHeight - this.durationFirst) / (this.length - 1));
      },
      // The calculated height for the elements the user is actually scrolling, 
      // which trigger the animations between slides
      triggerHeights() { 
        let total = 0;
        return this.slides.map((_, index) => {
          // First and last scenes are static height the others 
          // are calculated portion of total height of the scene. 
          let duration = index === 0 ? this.durationFirst : this.triggerHeight;
          // Collect total so that we can add any difference (from rounding) to the last slide.
          // Ensuring all of the heights are exactly equal to the scene height.
          total += duration;
          // Add difference to last slide so heights are exactly equal to sceneHeight
          if (index === this.length - 1) duration += this.sceneHeight - total;
          return duration;
        });
      }
    },
    methods: {
      // State changes when the user is withing the main scene,
      // which contains the entire slide show
      withinMainScene(within) {
        this.$store.commit('SET_ABOUT_NAV_TRANSPARENT_ACTIVE', within);
        this.afterScene = !within;
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
    },
    beforeDestroy() {
      // Destroy the scroll magic instance and the resize handler, in case this 
      // component is mounted again in the future
      this.controller.destroy(true);
      window.removeEventListener('resize', this.reziseHandler);
    },
    mounted() {
      // DOM references from template
      const { triggers, wrap, presentation } = this.$refs;
      // Attach scenes for each trigger element these will fire the animations
      // like keyframes between the scroll points
      this.triggerScenes = triggers.map((trigger, index) => {
        // Create a new scene for each trigger
        // the duration is set to the height of the trigger element
        // calculated above in computed property
        // Attach handler on scene enter to change the active slide
        return new ScrollMagic.Scene({
            triggerElement: trigger,
            triggerHook: 0,
            duration: this.triggerHeights[index]
          })
          .on('enter', () => this.activeIndex = index)
          .addTo(this.controller);
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
        .on('progress', (e) => this.onProgress(e.progress))
        .on('end', ({ state }) => this.withinMainScene(state === "DURING"))
        .addTo(this.controller);

      if (!this.supportsPositionSticky) {
        this.mainScene.setPin(presentation);
      }

      // Add resize handler to update the values when the screen size changes
      this.reziseHandler = debounce(this.onResize, 500, false, this);
      window.addEventListener('resize', this.reziseHandler);
    }
  };

  /**
   *   Check browser support for position: sticky
   *   - https://stackoverflow.com/questions/60214332/dynamically-detect-if-positionsticky-is-supported-by-the-browser
   *   @return {Boolean}
   */
  function browserWithPositionSticky() {
    var prop = 'position:';
    var value = 'sticky';
    var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
    var el = document.createElement('a');
    var mStyle = el.style;
    mStyle.cssText = prop + prefixes.join(value + ';' + prop).slice(0, - prop.length);
    return mStyle.position.indexOf(value) !== -1;
  };
</script>

<style lang="scss">
  $debug-slideshow: false;
  $bg-color: $color-violet;
  $sides: 10vw;
  $sides--dots: 5vw;
  $anim-duration--bg: 800ms;
  $anim-duration--text: 500ms;
  $anim-delay--bg: 400ms;
  $anim-delay--text: 800ms;
  $anim-timing--bg: ease;
  $anim-timing--text: ease;
  $anim-slide-transform: 50; // Amount to animate translates of slide content
  $dot-size: 0.75rem;
  $dot-space: 0.5rem;

  .ScrollPoints {
    position: relative;
    background-color: $bg-color;
    &__controls {
      will-change: opacity; 
    }
    &__triggers {
      @if ($debug-slideshow) {
        opacity: 0.2;
        position: relative;
        z-index: 10;
      } @else {
        opacity: 0;
        visibility: hidden;
      }
      .ScrollPoints--use-position-sticky & {
        // Pull it under the full amount of the presentation
        margin-top: -100vh; 
        // Additional padding on bottom when using the 
        // sticky method increases last slide duration
        // before it disengages
        padding-bottom: 100vh;
      }
      .ScrollPoints--no-position-sticky & {
        position: absolute;
        top: 0;
        bottom: 0;
      }
    }
    &__trigger {
      @if ($debug-slideshow) {
        background-color: yellow;
        &:nth-child(odd) {
          background-color: red;
        }
      }
    }
    &__presentation {
      overflow: hidden;
      color: white;
      height: 100vh;
      // Using position sticky for better performance on newer browsers
      .ScrollPoints--no-position-sticky & {
        position: relative;
      }
      .ScrollPoints--use-position-sticky & {
        position: sticky;
        top: 0;
      }
    }
    &__background {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      opacity: 0;
      transition-duration: $anim-duration--bg;
      transition-property: opacity, transform;
      transition-delay: 0;
      transition-timing-function: $anim-timing--bg;
      transform: scale(1.01);
      will-change: transform, opacity;
      background-size: cover;
        background-repeat: no-repeat;
      &--active  {
        opacity: 1;
        transition-delay: $anim-delay--bg;
        transform: scale(1);
      }
    }
    &__slide {
      position: absolute;
      top: 50%;
      width: $text-max-width;
      transform: translate(0, -50%);
      opacity: 0;
      transition-duration: $anim-duration--text;
      transition-timing-function: $anim-timing--text;
      transition-delay: 0;
      transition-property: opacity, transform;
      pointer-events: none;
      will-change: opacity;
      &--layout {
        &-center {
          text-align: center;
          left: 50%;
          transform: translate(-50%, -50%);
          .ScrollPoints__slide-content {
            transform: translate(0, -50px);
          }
        }
        &-left {
          text-align: left;
          left: $sides;
          .ScrollPoints__slide-content {
            transform: translate(-50px, 0);
          }
        }
        &-right {
          right: $sides;
          text-align: right;
          .ScrollPoints__slide-content {
            transform: translate(50px, 0);
          }
        }
      }
      &--active {
        opacity: 1;
        pointer-events: auto;
        transition-delay: $anim-delay--text;
        .ScrollPoints__slide-content {
          transform: translate(0, 0);
        }
      }
      &-content {
        text-shadow: 0 1px 6px rgba($bg-color, 0.75);
        transition-property: transform;
        transition-duration: $anim-duration--text;
        transition-delay: $anim-delay--text;
        transition-timing-function: $anim-timing--text;
        color: white;
        will-change: transform;
        h2 {
          color: inherit;
        }
      }
      &-title {
        margin-bottom: 1rem;
        line-height: $text-line-height--densest;
        position: relative;
        // Removing focus styling on non-interactive focus
        // when a user clicks the dot-nav and is begin programmatically 
        // focused on the slide title
        &:focus {
          outline: none;
        }
      }
      &-body {
        line-height: $text-line-height--dense;
      }
    }
    &__nav {
      position: absolute;
      right: $sides--dots;
      top: 50%;
      transform: translateY(-50%);
      &-dot {
        display: block;
        width: $dot-size;
        height: $dot-size;
        border-radius: 50%;
        border: 1px solid white;
        opacity: 0.5;
        margin: $dot-space 0;
        transition: opacity 300ms, transform 300ms;
        will-change: opacity, transform;
        &--active {
          outline: none;
          box-shadow: $shadow;
          background-color: white;
          transform: scale(1.25);
          opacity: 0.75;
          border-color: white;
          box-shadow: $shadow;
          &:focus {

          }
        }
        &:hover,
        &:focus {
          outline: none;
          box-shadow: 0 1px 12px rgba($color-yellow-orange, 1);
          transform: scale(1.25);
          opacity: 1;
        }
      }
    }
    &__exit-button {
      position: absolute;
      bottom: $unit-large;
      left: 50%;
      transform: translateX(-50%);
      padding: 1rem 0;
      text-align: center;
    }
    &__progress {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      &-bar {
        height: 6px;
        width: 100%;
        background-color: rgba(white, 0.5);
        transition: transform 200ms;
        transform-origin: center left;
        transform: scaleX(0);
      }
    }
  }
</style>