<template>
  <label class="gk-checkbox" :class="{'gk-checkbox-checked':checked}">
    <span aria-checked="mixed">
      <i :class="{'gk-icon-checkbox':!checked, 'gk-icon-checkcircle':checked}"></i>
      <slot></slot>
      <input ref="checkbox" aria-hidden="true" :checked="checked" @change="changeChecked" type="checkbox"/>
    </span>
  </label>
</template>

<script>
  export default {
    name: "GkCheckbox",
    props: {
      'is-checked': Boolean,
      value: Boolean
    },
    data() {
      return {
        checked: this.isChecked
      };
    },
    watch: {
      'isChecked': 'updateChecked',
      'checked': 'updateValue'
    },
    methods: {
      updateValue(value) {
        this.$emit('input', value);
      },
      updateChecked() {
        this.checked = this.isChecked;
      },
      changeChecked(event) {
        this.checked = this.$refs.checkbox.checked;
        this.$emit('change', this.checked, event);
      },
      setChecked(value) {
        this.checked = value;
      }
    }
  }
</script>