<template>
    <li class="gk-dropdown-item">
        <a href="javascript:;" @click="handleClick"><i v-if="icon" :class="icon"></i><slot></slot></a>
    </li>
</template>

<script>
  export default {
    name: "GkDropdownItem",
    props: {
      divided: Boolean,
      disabled: Boolean,
      command: String|Object|Array|Number,
      icon: String
    },
    computed: {
      dropdown() {
        return this.$parent.$parent;
      }
    },
    methods: {
      handleClick() {
        this.dropdown.$emit('command', this.command);
      }
    }
  }
</script>