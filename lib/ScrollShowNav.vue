<template>
  <ul class="scroll-show__nav">
    <li 
      class="scroll-show__nav-item"
      v-for="(_, index) in triggers"
      :key="index"
      :class="{ 'is-active' : index === activeIndex }"
    >
      <button 
        @click="goto(index)"
        class="scroll-show__nav-button"
        :aria-label="`goto part ${ index }`"
        :class="{ 'is-active' : index === activeIndex }"
      >
        <slot 
          name="nav"
          :index="index"
          :active="index === activeIndex"
        >
          {{  index + 1 }}
        </slot>
      </button>
    </li>
  </ul>
</template>

<script>
  import { ACTIVE_INDEX, TRIGGERS, GOTO } from "./symbols.js";
  export default {
    name: "ScrollShowNav",
    inject: {
      activeIndex: { from: ACTIVE_INDEX },
      triggers: { from: TRIGGERS },
      goto: { from: GOTO }
    }
  };
</script>