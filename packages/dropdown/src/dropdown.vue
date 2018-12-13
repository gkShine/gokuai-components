<template>
  <div class="gk-dropdown" :class="{'gk-dropdown__opened': opened}">
    <slot></slot>
    <slot name="dropdown"></slot>
  </div>
</template>

<script>
  export default {
    name: 'GkDropdown',
    data() {
      return {
        opened: false
      }
    },
    computed: {
      btn() {
        return this.$el.childNodes[0];
      }
    }
  }
</script>