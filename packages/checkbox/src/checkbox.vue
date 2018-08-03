<template>
    <input ref="checkbox" class="gk-checkbox" @change="changeValue" type="checkbox" :class="{'gk-checkbox-checked':checked}"/>
</template>

<script>
  export default {
    name: "GkCheckbox",
    data() {
      return {
        checked: false
      };
    },
    methods: {
      changeValue() {
        this.checked = this.$refs.checkbox.checked;
      }
    }
  }
</script>