<template>
  <component :is="element" class="scroll-show__slide" ref="element">
    <slot/>
  </component>
</template>

<script>
  import { REGISTER, UNREGISTER } from "./symbols.js";
  export default {
    name: "ScrollShowSlide",
    props: {
      element: {
        type: String,
        default: "div"
      }
    },
    inject: {
      register: { from: REGISTER }, 
      unregister: { from: UNREGISTER },
    },
    mounted() {
      if (this.register) {
        this.register(this);
      }
    },
    unmounted() {
      if (this.unregister) {
        this.unregister(this);
      }
    }
  };
</script>