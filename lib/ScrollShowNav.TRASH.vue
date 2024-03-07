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

<style lang="scss">
  .scroll-show__nav {
    position: absolute;
    width: auto;
    top: 50%;
    right: 2rem;
    width: max-content;
    // margin-left: auto;
    // margin-right: 2em;
  }
  .scroll-show__nav-list {
    height: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-auto-flow: row;
    grid-template-rows: auto;
  }
  .scroll-show__nav-item {
    display: flex;
    align-items: center;
    justify-items: center;
  }
</style>
