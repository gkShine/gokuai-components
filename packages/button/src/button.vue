<template>
    <button class="gk-button"><i v-if="icon" :class="icon"></i><slot></slot></button>
</template>

<script>
  export default {
    name: "GkButton",
    props: {
      icon: String
    }
  }
</script>