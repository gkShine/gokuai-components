<template>
    <li class="gk-dropdown-item" @click="handleClick" >
        <a href="javascript:;"><i v-if="icon" :class="icon"></i><slot></slot></a>
    </li>
</template>

<script>
  export default {
    name: "GkDropdownItem",
    props: {
      divided: Boolean,
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