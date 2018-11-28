<template>
  <label class="gk-checkbox" :class="{'gk-checkbox-checked':checked}">
    <span aria-checked="mixed">
      <i :class="{'gk-icon-checkbox':!checked, 'gk-icon-checkcircle':checked}"></i>
      <input ref="checkbox" aria-hidden="true" :checked="checked" @change="changeChecked" type="checkbox"/>
    </span>
  </label>
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