<template>
  <i :class="{['gk-icon-' + icon]: true, ['gk-icon--' + placement]: placement !== undefined}"></i>
</template>

<script>
  export default {
    name: "GkIcon",
    props: {
      placement: String,
      icon: {
        type: String,
        required: true
      }
    }
  }
</script>
