<template>
    <li class="gk-menu-item">
        <a href="javascript:;" @click="handleClick"><i v-if="icon" :class="icon"></i><slot></slot></a>
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
        this.menu.$emit('command', this.command);
        this.dropdown && this.dropdown.$emit('command', this.command);
      }
    }
  }
</script>