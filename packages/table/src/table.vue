<template>
    <section class="gk-table" :class="{'gk-table-with-header':showHeader, 'gk-table-show-checkbox':showAllCheckbox || showCheckbox}">
        <table class="gk-table-header" v-show="showHeader">
            <thead>
            <tr>
                <slot></slot>
                <th v-if="hasScrollbar" class="gk-table-header-last"></th>
            </tr>
            </thead>
        </table>
        <virtual-scroller ref="table" class="gk-table-virtual gk-scrollbar" contentClass="gk-table-body" :items="data"
                          content-tag="table" :item-height="itemHeight">
            <template slot-scope="props">
                <tr
                        class="gk-table-item"
                        :class="{'gk-table-item-active':selectedInx === props.itemIndex}"
                        @click="selectItem(props.item, props.itemIndex, $event)"
                        @dblclick="dblclickItem(props.item, props.itemIndex, $event)"
                >
                    <gk-table-cell :check="checkItem" :index="props.itemIndex" :data="props.item" :column="column" v-for="(column, idx) in columns" :key="idx"></gk-table-cell>
                </tr>
            </template>
        </virtual-scroller>
    </section>
</template>

<script>
  import {VirtualScroller} from 'vue-virtual-scroller';
  import _ from 'lodash';
  import GkTableCell from "./table-cell.js";

  export default {
    name: "GkTable",
    components: {
      GkTableCell,
      VirtualScroller
    },
    props: {
      'show-header': Boolean,
      'show-checkbox': Boolean,
      'selected-index': Number,
      data: {
        type: Array,
        required: true
      },
      itemHeight: {
        type: Number,
        default: 42
      }
    },
    data() {
      return {
        selected: {},
        checkedItems: {},
        selectedInx: this.selectedIndex,
        showAllCheckbox: false,
        hasScrollbar: false,
        clickTimer: false
      }
    },
    computed: {
      columns() {
        let columns = [];
        this.$children.forEach((column) => {
          if (column.isTableColumn) {
            columns.push(Object.assign({
              columnStyle: Object.assign({height: this.itemHeight + 'px'}, column.columnStyle),
              render: column.$scopedSlots.default
            }, column.$props));
          }
        });
        return columns;
      }
    },
    methods: {
      selectItem(item, index, event) {
        clearTimeout(this.clickTimer);
        this.clickTimer = setTimeout(() => {
          this.selected = item;
          this.selectedInx = index;
          this.$emit('select', item, index, event);
        }, 20);
      },
      dblclickItem(item, index, event) {
        clearTimeout(this.clickTimer);
        this.$emit('dblclick', item, index, event);
      },
      checkItem(item, index, {target}) {
        if (target.checked) {
          this.checkedItems[index] = item;
        } else {
          delete this.checkedItems[index];
        }
        !this.showCheckbox && (this.showAllCheckbox = Object.keys(this.checkedItems).length > 0);
      },
      checkAllItems() {

      },
      setScrollbar() {
        let el = this.$refs.table.$el;
        this.hasScrollbar = this.itemHeight * this.data.length > el.clientHeight;
      },
      watchScrollbar() {
        this.setScrollbar();
        window.onresize = _.debounce(() => { this.setScrollbar(); }, 5);
      }
    },
    mounted() {
      this.watchScrollbar();
    }
  }
</script>