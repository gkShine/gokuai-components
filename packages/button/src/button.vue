<template>
    <button class="gk-button" :class="{'gk-button-plain':plainCls}" v-if="type === 'button'"><i v-if="icon" :class="icon"></i><slot></slot></button>
    <div class="gk-button" :class="{'gk-button-plain':plainCls}" v-else-if="type === 'html'"><i v-if="icon" :class="icon"></i><slot></slot></div>
    <span class="gk-button" :class="{'gk-button-plain':plainCls}" v-else-if="type === 'text'"><i v-if="icon" :class="icon"></i><slot></slot></span>
</template>

<script>
  export default {
    name: "GkButton",
    props: {
      plain: Boolean,
      icon: String,
      type: {
        type: String,
        default: 'button'
      }
    },
    computed: {
      plainCls() {
        return this.plain || this.$parent.plain;
      }
    }
  }
</script>