<template>
    <i :class="{['gk-icon-' + icon]: true, ['gk-icon--' + placement]: placement !== null}"></i>
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
