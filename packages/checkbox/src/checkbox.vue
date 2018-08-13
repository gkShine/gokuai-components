<template>
    <input ref="checkbox" :aria-checked="checked" :checked="checked" class="gk-checkbox" @change="changeValue" type="checkbox" :class="{'gk-checkbox-checked':checked}"/>
</template>

<script>
  export default {
    name: "GkCheckbox",
    props: {
      'is-checked': Boolean
    },
    data() {
      return {
        checked: this.isChecked
      };
    },
    methods: {
      changeValue() {
        this.checked = this.$refs.checkbox.checked;
      }
    }
  }
</script>