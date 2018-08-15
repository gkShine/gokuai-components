<template>
    <th :style="columnStyle" :class="{'gk-table-checkbox':checkbox}">
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
      width: Number|String,
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
          width: typeof this.width === 'number' ? this.width + 'px' : this.width,
          'text-align': this.align
        }
      }
    },
    methods: {
      checkAll({target}) {
        this.$parent.handleCheckAll(target.checked);
      }
    }
  }
</script>