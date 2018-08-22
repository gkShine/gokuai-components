<template>
    <div class="gk-button-group"><slot></slot></div>
</template>

<script>
  export default {
    name: "GkButtonGroup",
    props: {
      plain: Boolean
    }
  }
</script>