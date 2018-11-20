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
        return this.$el.childNodes[0];
      }
    }
  }
</script>