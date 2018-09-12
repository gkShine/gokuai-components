<template>
    <th :style="columnStyle" :class="columnClass" @click="handleClick">
        <gk-checkbox type="checkbox" v-if="checkbox" @click.native="checkAll($event)" ></gk-checkbox>
        <span v-else>{{label}}</span>
        <span class="sortable" :class="{'sortable-desc':order === 'desc', 'sortable-asc':order === 'asc'}" v-if="showSort">
            <i class="sort-caret asc"></i>
            <i class="sort-caret desc"></i>
        </span>
    </th>
</template>

<script>
  import GkCheckbox from "gokuai-components/packages/checkbox/src/checkbox";
  export default {
    name: "gkTableColumn",
    components: {GkCheckbox},
    data() {
      return {
        isTableColumn: true,
        order: this.sortable
      }
    },
    props: {
      label: String,
      width: Number|String,
      checkbox: Boolean,
      property: String,
      sortable: Boolean|String,
      align: {
        type: String,
        default: 'left'
      },
      formatter: Function
    },
    computed: {
      columnClass() {
        return {
          'gk-table-checkbox':this.checkbox,
          'gk-table-sortable':this.showSort
        };
      },
      columnStyle() {
        return {
          width: typeof this.width === 'number' ? this.width + 'px' : this.width,
          'text-align': this.align
        }
      },
      showSort() {
        return this.sortable !== undefined;
      }
    },
    methods: {
      checkAll({target}) {
        this.$parent.handleCheckAll(target.checked);
      },
      handleClick() {
        if (!this.showSort) {
          return false;
        }
        switch (this.order) {
          case 'asc':
            this.order = 'desc';
            break;
          case 'desc':
            this.order = '';
            break;
          default:
            this.order = 'asc';
        }
        //清楚其他排序
        this.$parent.$children.forEach((child) => {
          if (this._uid !== child._uid && child.showSort) {
            child.order = undefined;
          }
        });
        this.$parent.handleSort(this.property, this.order);
      }
    }
  }
</script>