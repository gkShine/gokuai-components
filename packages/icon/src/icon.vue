<template>
    <i :class="'gk-icon-' + icon"></i>
</template>

<script>
  export default {
    name: "GkIcon",
    props: {
      icon: {
        type: String,
        required: true
      }
    }
  }
</script>
