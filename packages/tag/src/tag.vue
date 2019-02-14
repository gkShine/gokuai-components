<template>
  <label class="gk-tag" :class="{['gk-tag--' + type]: type, ['gk-tag--' + size] : size}" :style="computedStyle"><slot /><gk-icon icon="times" @click="handleClose" v-if="closeable"></gk-icon></label>
</template>

<script>
  import GkIcon from "gokuai-components/packages/icon/src/icon";

  export default {
    name: "GkTag",
    components: {GkIcon},
    props: {
      type: String,
      size: String,
      closeable: Boolean,
      color: String
    },
    computed: {
      computedStyle() {
        return {
          'background-color': this.color
        }
      }
    },
    methods: {
      handleClose() {
        this.$emit('close')
      }
    }
  }
</script>