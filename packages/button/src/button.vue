<template>
    <div class="gk-button" :class="computedClass" v-if="type === 'html'"><i v-if="icon" :class="icon"></i>
        <slot></slot>
    </div>
    <span class="gk-button" :class="computedClass" v-else-if="type === 'text'"><i v-if="icon" :class="icon"></i><slot></slot></span>
    <button class="gk-button" :class="computedClass" v-else><i v-if="icon" :class="icon"></i>
        <slot></slot>
    </button>
</template>

<script>
  export default {
    name: "GkButton",
    props: {
      'is-actived': Boolean,
      size: String,
      plain: Boolean,
      icon: String,
      type: {
        type: String,
        default: 'button'
      }
    },
    computed: {
      isPlain() {
        let parent = this;
        while (parent) {
          if (parent.plain) {
            return true;
          }
          parent = parent.$parent;
        }
      },
      computedClass() {
        let classList = {
          'gk-button-plain': this.isPlain,
          'gk-button-active': this.isActived
        };
        if (['medium', 'small', 'mini'].indexOf(this.size) > -1) {
          classList['gk-button--' + this.size] = true;
        }
        if (['primary', 'success', 'info', 'warning', 'danger'].indexOf(this.type) > -1) {
          classList['gk-button--' + this.type] = true;
        }
        return classList;
      }
    }
  }
</script>