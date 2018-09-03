<template>
    <button class="gk-button" :class="computedClass" v-if="type === 'button'"><i v-if="icon" :class="icon"></i><slot></slot></button>
    <div class="gk-button" :class="computedClass" v-else-if="type === 'html'"><i v-if="icon" :class="icon"></i><slot></slot></div>
    <span class="gk-button" :class="computedClass" v-else-if="type === 'text'"><i v-if="icon" :class="icon"></i><slot></slot></span>
</template>

<script>
  export default {
    name: "GkButton",
    props: {
      size: String,
      plain: Boolean,
      icon: String,
      type: {
        type: String,
        default: 'button'
      }
    },
    computed: {
      computedClass() {
        let classList = {
          'gk-button-plain': this.plain || this.$parent.plain
        };
        if (['medium', 'small', 'mini'].indexOf(this.size) > -1) {
          classList['gk-button--' + this.size] = true;
        }
        return classList;
      }
    }
  }
</script>