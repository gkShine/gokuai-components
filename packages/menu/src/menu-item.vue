<template>
    <li class="gk-menu-item" :class="{'gk-menu-item-disable':disabled}" @click="handleClick">
        <i v-if="icon" :class="icon"></i><slot></slot>
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
      handleClick() {
        if (this.disabled) {
          return;
        }
        this.menu.$emit('command', this.command);
        this.dropdown && this.dropdown.$emit('command', this.command);
      }
    }
  }
</script>