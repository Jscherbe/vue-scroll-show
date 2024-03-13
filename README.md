# @ulu/vue-scroll-show

Minimal component to create sticky scrolling based slideshow. Uses [Scrollmagic](https://www.npmjs.com/package/scrollmagic) library and position sticky to create scenes (like scroll keyframes). 

[View Demo](https://jscherbe.github.io/vue-scroll-show/)

Note: This component just provides a way to create scroll based sticky presentations. It doesn't provide styling, slides, or animations. It does provide two optional child components, 'ScrollShowNav' for display a list of links to each scene in a given presentation, and 'ScrollShowProgress' which provides a progress bar.

**Table of Contents:**

- [Props](#props)
- [Slot Props](#slot-props)
- [Events](#events)
- [Inject](#inject)
- [Usage](#usage)
- [Changelog](#changelog)



## Props

- **scenes** {Number, Array} - The amount of scenes to create (since they are simulated), optionally provide an array of scenes (where the value will be the duration/height of the given scene)
- **sceneHeight** {Function, String,} - The height of each scene (when not specifying 'scenes' with array), should be a valid css unit (100dvh for example) or function that is passed the scene index and expects a string returned
- **height** {Function, String, Number} - Works the same as 'sceneHeight' but sets the height for the presentation (the presentation is the sticky element that displays the scenes)

## Slot Props

The following are provided as slot props to be used to control your animations/slides/etc

- **activeIndex** {Number} - The currently active index (defaults to 0, first scene)
- **progress** {Number} - Fraction of 1 representing percentage complete (0-1)
- **scrollTo** {Function} - Trigger programmatic scroll to a given scene (argument is index of scene)
- **active** {Boolean} - Whether the show is active (in view and triggered)
- **scrollDirection** {String} - Current scroll direction (null if not within main scene)
- **resolvedHeight** {Number} - The calculated height for the show, if needed
  
## Events

- **initialized** - Triggered when the scrollmagic scenes have been setup, or if props change (scenes, etc)
- **scrollTo** - Triggered when programmatic navigation occurs (through nav click or calling 'scrollTo' method). Argument object contains 'index' that was scrolled to
- **sceneChange** - Triggered when a scene changes, argument object includes 'index' of scene
- **enter** - Triggered when the show is entered (from above or below). Argument object contains 'scrollDirection'
- **exit** - Triggered when the show is exited (from above or below). Argument object contains 'scrollDirection'
- **progress** - Triggered when the show progress changes. This is handler is called frequently suggest RAF. Passed event object from scrollmagic scene progress.

## Inject

The library provides symbols for injection. This is only useful if you are building something for this that you don't want to have to pass props down through. Please look at libraries implementation of ScrollShowProgress, or ScrollShowNav for examples.

Available for injection:

**ACTIVE_INDEX** {Number}
**PROGRESS** {Number}
**TRIGGERS** {Array}
**SCROLLTO** {Function}


## Usage

See demo at "./src/App.vue" in this repository for complete example(s).

Example with 5 scenes, set to twice the windows height

```vue
<template>
  <ScrollShow 
    class="custom-show" 
    :scenes="slides.length"
    sceneHeight="200vh"
    height="100vh"
    v-slot="{ activeIndex }"
  >
    <!-- Adding the library's nav component -->
    <ScrollShowNav/>

    <!-- Our custom show can be anything, here we are just hiding and showing text and images -->
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

    <!-- Adding the library's progress component -->
    <ScrollShowProgress/>
  </ScrollShow>
</template>

<script setup>
  import "@ulu/vue-scroll-show/style.css";
  import { ScrollShow, ScrollShowNav, ScrollShowProgress } from "@ulu/vue-scroll-show/lib.js";
  import scenes from "./scenes"; // ie. [{ image, text}, ... ]
</script>

<style lange="scss">
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
  .custom-show-fade-enter-active,
  .custom-show-fade-leave-active {
    transition: opacity 0.5s ease;
  }

  .custom-show-fade-enter-from,
  .custom-show-fade-leave-to {
    opacity: 0;
  }
</style>

```

## Changelog

- [Change Log](CHANGELOG.md)