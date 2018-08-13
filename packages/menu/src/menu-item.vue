<template>
    <li class="gk-menu-item" :class="{'gk-menu-item-disabled':disabled}" @click="handleClick" :aria-disabled="disabled">
        <i v-if="icon" :class="icon"></i><slot></slot>
        <span class="gk-menu-item-right"><slot name="after"></slot><i v-if="hasSub" class="fa fa-caret-right"></i></span>
    </li>
</template>

<script>
  export default {
    name: "GkMenuItem",
    props: {
      divided: Boolean,
      disabled: Boolean,
      command: String|Object|Array|Number,
      icon: String
    },
    data() {
      return {
        hasSub: false
      }
    },
    computed: {
      menu() {
        return this.$parent;
      },
      dropdown() {
        let parent = this.$parent.$parent;
        if (parent && parent.$el.className === 'gk-dropdown') {
          return parent;
        }
        return null;
      }
    },
    methods: {
      handleClick(event) {
        if (this.disabled) {
          event.stopPropagation();
          return;
        }
        this.menu.$emit('command', this.command);
        this.dropdown && this.dropdown.$emit('command', this.command);
      }
    },
    mounted() {
      let children = this.$children;
      for (let i = 0; i < children.length; i++) {
        if (children[i].$el.className.indexOf('gk-menu') > -1) {
          this.hasSub = true;
        }
      }
    }
  }
</script>