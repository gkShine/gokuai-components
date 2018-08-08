<template>
    <th :style="columnStyle" >
        <gk-checkbox type="checkbox" v-if="checkbox" @click.native="checkAll($event)" ></gk-checkbox>
        <span v-else>{{label}}</span>
    </th>
</template>

<script>
  import GkCheckbox from "../../checkbox/src/checkbox";
  export default {
    name: "gkTableColumn",
    components: {GkCheckbox},
    data() {
      return {
        isTableColumn: true
      }
    },
    props: {
      label: String,
      width: Number,
      checkbox: Boolean,
      property: String,
      align: {
        type: String,
        default: 'left'
      },
      formatter: Function
    },
    computed: {
      columnStyle() {
        return {
          width: this.width + 'px',
          'text-align': this.align
        }
      }
    },
    methods: {
      checkAll({target}) {
        this.$parent.checkAllItems(target.checked);
      }
    }
  }
</script>