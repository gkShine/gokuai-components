<template>
    <input ref="checkbox" :aria-checked="checked" :checked="checked" class="gk-checkbox" @change="changeChecked" type="checkbox" :class="{'gk-checkbox-checked':checked}"/>
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
    watch: {
      'isChecked': 'updateChecked'
    },
    methods: {
      updateChecked() {
        this.checked = this.isChecked;
      },
      changeChecked() {
        this.checked = this.$refs.checkbox.checked;
      },
      setChecked(value) {
        this.checked = value;
      }
    }
  }
</script>