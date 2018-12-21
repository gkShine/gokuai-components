<template>
  <div class="gk-input" :class="{
    'is-disabled': disabled,
    ['gk-input--' + size]: !!size,
    'gk-input--prefix': prefixIcon,
    'gk-input--suffix': suffixIcon,
    'gk-input--sync': syncColor,
    'gk-input--focus': isFocus,
    'gk-input-group': $slots.prepend || $slots.append,
    'gk-input-group--prepend': $slots.prepend,
    'gk-input-group--append': $slots.append
  }">
    <div class="gk-input-group__prepend" v-if="$slots.prepend">
      <slot name="prepend"></slot>
    </div>
    <span class="gk-input__prefix" v-if="prefixIcon"><gk-icon :icon="prefixIcon"></gk-icon></span>
    <input ref="input" v-model="input" @change="handleChange" @focus="handleFocus" @blur="handleBlur" :autofocus="autofocus"
           class="gk-input__inner" :readonly="readonly" :disabled="disabled" :placeholder="placeholder"/>
    <span class="gk-input__suffix" v-if="suffixIcon"><gk-icon :icon="suffixIcon"></gk-icon></span>
    <div class="gk-input-group__append" v-if="$slots.append">
      <slot name="append"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "GkInput",
    props: {
      value: String,
      size: String,
      autofocus: Boolean,
      readonly: Boolean,
      disabled: Boolean,
      placeholder: String,
      'sync-color': Boolean,
      'prefix-icon': String,
      'suffix-icon': String
    },
    data() {
      return {
        input: this.value,
        isFocus: false
      }
    },
    watch: {
      value: 'updateValue'
    },
    methods: {
      updateValue(value) {
        this.input = value;
      },
      handleFocus(event) {
        this.isFocus = true;
        this.$emit('focus', event);
      },
      handleBlur(event) {
        this.isFocus = false;
        this.$emit('blur', event);
      },
      handleChange(event) {
        this.$emit('change', this.input, event);
        this.$emit('input', this.input);
      }
    },
    mounted() {
      if (this.autofocus) {
        this.$refs.input.focus();
      }
    }
  }
</script>