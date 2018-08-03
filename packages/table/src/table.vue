<template>
    <section class="gk-table" :class="{'gk-table-with-header':showHeader, 'gk-table-show-checkbox':showAllCheckbox}">
        <table class="gk-table-header" v-show="showHeader">
            <thead>
            <tr>
                <slot></slot>
                <th class="gk-table-header-last"></th>
            </tr>
            </thead>
        </table>
        <virtual-scroller class="gk-table-virtual gk-scrollbar" contentClass="gk-table-body" :items="data" content-tag="table" :item-height="itemHeight">
            <template slot-scope="props">
                <tr
                    class="gk-table-item"
                    :class="{'gk-table-item-active':selectedIndex === props.itemIndex}"
                    @click="handleItem(props.item, props.itemIndex)" >
                    <td
                        :style="Object.assign(column.columnStyle, {height: (itemHeight - 3) + 'px'})"
                        v-for="(column, idx) in columns" :key="idx" >
                        <gk-checkbox v-if="column.checkbox" @click.native="checkItem(props.item, props.itemIndex, $event.target)"></gk-checkbox>
                        <span v-else-if="column.property" >{{getLabel(props.item, column)}}</span>
                    </td>
                </tr>
            </template>
        </virtual-scroller>
    </section>
</template>

<script>
  import { VirtualScroller } from 'vue-virtual-scroller';
  import GkCheckbox from "../../checkbox/src/checkbox";

  export default {
    name: "GkTable",
    components: {
      GkCheckbox,
      VirtualScroller
    },
    props: {
      'show-header': Boolean,
      data: {
        type: Array,
        required: true
      },
      itemHeight: {
        type: Number,
        default: 36
      }
    },
    data() {
      return {
        selectedItem: {},
        checkedItems: {},
        selectedIndex: -1,
        showAllCheckbox: false,
        columns: []
      }
    },
    methods: {
      handleItem(item, index) {
        this.selectedItem = item;
        this.selectedIndex = index;
      },
      checkItem(item, index, target) {
        if (target.checked) {
          this.checkedItems[index] = item;
        } else {
          delete this.checkedItems[index];
        }
        this.showAllCheckbox = Object.keys(this.checkedItems).length > 0;
      },
      getLabel(item, column) {
        let label = item[column.property];
        if (column.formatter) {
          return column.formatter(label);
        }
        return label;
      }
    },
    mounted() {
      let columns = [];
      this.$children.forEach((column) => {
        if (column.isTableColumn) {
          columns.push(Object.assign({
            columnStyle: column.columnStyle
          }, column.$props));
        }
      });
      this.columns = columns;
    }
  }
</script>