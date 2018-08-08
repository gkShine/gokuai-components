<template>
    <section class="gk-slide" :class="{'gk-slide-fit': fit}">
        <slot></slot>
    </section>
</template>

<script>
  export default {
    name: "gkSlide",
    props: {
      fit: Boolean
    }
  }
</script>