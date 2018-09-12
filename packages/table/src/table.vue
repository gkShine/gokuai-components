<template>
    <section class="gk-table" :style="tableStyle"
             :class="{'gk-table-with-header':showHeader, 'gk-table-fit': fit, 'gk-table-show-checkbox': showCheckbox}">
        <template v-if="data.length">
            <table ref="thead" class="gk-table-header" v-show="showHeader">
                <thead>
                <tr>
                    <slot></slot>
                    <th v-if="hasScrollbar" class="gk-table-header-last"></th>
                </tr>
                </thead>
            </table>
            <virtual-scroller @contextmenu.native="handleContextmenu(null, null, $event)" :style="computedStyle"
                              v-scroll-load="loadMore" v-loading="loading" ref="table"
                              class="gk-table-virtual gk-scrollbar" contentClass="gk-table-body" :items="data"
                              @click.native="handleCancelSelect()"
                              content-tag="table" :item-height="itemHeight">
                <template slot-scope="props">
                    <tr
                            class="gk-table-item"
                            :class="{'gk-table-item-active':selected[props.itemIndex] !== undefined}"
                            @click="handleSelect(props.item, props.itemIndex, $event)"
                            @dblclick="handleDblclick(props.item, props.itemIndex, $event)"
                            @contextmenu="handleContextmenu(props.item, props.itemIndex, $event)"
                    >
                        <gk-table-cell @check="handleCheck" :is-checked="checked[props.itemIndex] !== undefined"
                                       :index="props.itemIndex" :data="props.item" :column="column"
                                       v-for="(column, idx) in columns" :key="idx"></gk-table-cell>
                    </tr>
                </template>
            </virtual-scroller>
            <div v-if="showMore" class="gk-table-more">
                <span class="gk-table-more-text">{{moreText}}</span>
            </div>
        </template>
        <div v-else class="gk-table-empty">
            <slot name="empty"></slot>
        </div>
    </section>
</template>

<script>
  import GkTableMixin from "gokuai-components/packages/table/src/table-mixin";
  import GkTableCell from "gokuai-components/packages/table/src/table-cell";
  import {VirtualScroller} from "vue-virtual-scroller";

  export default {
    name: "GkTable",
    mixins: [GkTableMixin],
    components: {GkTableCell, VirtualScroller},
    props: {
      height: Number,
      'show-more': Boolean,
      'show-header': Boolean,
      data: {
        type: Array,
        required: true
      },
      'more-text': {
        type: String,
        default: 'loading...'
      },
      'item-height': {
        type: Number,
        default: 42
      }
    },
    data() {
      return {
        timer: 0,
        page: 1,
        hasScrollbar: false
      }
    },
    computed: {
      computedStyle() {
        let style = {};
        if (!this.$refs.thead) {
          return;
        }
        if (!this.fit && this.height) {
          let height = this.height;
          if (this.showHeader) {
            let headHeight = window.getComputedStyle(this.$refs.thead.querySelector('th:first-child')).height;
            height = height - parseInt(headHeight);
          }
          style.height = height + 'px';
        }
        return style;
      },
      tableStyle() {
        let style = {};
        if (this.fit) {
          return style;
        }
        if (this.height) {
          style.height = this.height + 'px';
        }
        return style;
      },
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
      handleSort(property, order) {
        this.$emit('sort-by', property, order);
      },
      refreshCheckAllState() {
        let headCheckbox = this.getHeadCheckbox();
        if (headCheckbox !== undefined) {
          let checkedLen = Object.keys(this.checked).length;
          headCheckbox.setChecked(checkedLen > 0 && checkedLen === this.data.length);
        }
      },
      getHeadCheckbox() {
        if (this.$refs.thead && this.$refs.thead.querySelector('th.gk-table-checkbox')) {
          return this.$children[0].$children[0];
        }
      },
      getCheckboxes() {
        let checkboxes = [];
        this.$refs.table.$children.forEach((child) => {
          if (child.$el.className.indexOf('gk-table-checkbox') > -1) {
            checkboxes.push(child.$children[0]);
          }
        });
        return checkboxes;
      },
      setScrollbar() {
        if (!this.$refs.table) {
          return;
        }
        let el = this.$refs.table.$el;
        this.hasScrollbar = this.itemHeight * this.data.length > el.clientHeight;
      },
      windowResize() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.setScrollbar();
        }, 5);
      },
      documentKeyDown(e) {
        if (this.handleShortcut(e) === false) {
          return false;
        }
        if (e.code === 'ArrowUp') {
          this.handleSelectPrevNext(-1, e);
          e.preventDefault();
        } else if (e.code === 'ArrowDown') {
          this.handleSelectPrevNext(+1, e);
          e.preventDefault();
        } else if (e.code === 'Enter') {
          this.handleDblclick(Object.values(this.selected)[0], Object.keys(this.selected)[0], e);
          e.preventDefault();
        }
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.setScrollbar();
      });
      window.addEventListener('resize', this.windowResize);
    },
    updated() {
      this.setScrollbar();
    },
    destroyed() {
      window.removeEventListener('resize', this.windowResize);
    }
  }
</script>