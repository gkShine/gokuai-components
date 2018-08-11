<template>
  <div class="gk-dropdown">
    <slot></slot>
    <slot name="dropdown"></slot>
  </div>
</template>

<script>
  export default {
    name: 'GkDropdown',
    computed: {
      btn() {
        return this.$children[0].$el;
      }
    }
  }
</script>