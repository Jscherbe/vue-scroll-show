<template>
  <div class="scroll-show__nav">
    <ul class="scroll-show__nav-list">
      <li 
        class="scroll-show__nav-item"
        v-for="(slide, index) in slides"
        :key="index"
        :class="{ 'is-active' : slide.active }"
      >
        <button 
          @click="gotoScene(index)"
          class="scroll-show__nav-button"
          :class="{ 'is-active' : slide.active }"
        >
          <slot 
            name="navigation"
            :index="index"
            :slide="slide"
            :active="slide.active"
          >
            {{  index + 1 }}
          </slot>
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "ScrollShowNav",
    props: {
      slides: Array,
      gotoScene: Function
    }
  };
</script>
