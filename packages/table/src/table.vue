<template>
    <section class="gk-table" :class="{'gk-table-with-header':showHeader, 'gk-table-fit': fit, 'gk-table-show-checkbox':showAllCheckbox || showCheckbox}">
        <table ref="thead" class="gk-table-header" v-show="showHeader">
            <thead>
            <tr>
                <slot></slot>
                <th v-if="hasScrollbar" class="gk-table-header-last"></th>
            </tr>
            </thead>
        </table>
        <virtual-scroller @contextmenu.native="handleContextmenu(null, null, $event)" :style="computedStyle" v-scroll-load="loadMore" v-loading="loading" ref="table" class="gk-table-virtual gk-scrollbar" contentClass="gk-table-body" :items="data" @click.native="handleCancelSelect()"
                          content-tag="table" :item-height="itemHeight">
            <template slot-scope="props">
                <tr
                        class="gk-table-item"
                        :class="{'gk-table-item-active':selected[props.itemIndex] !== undefined}"
                        @click="handleSelect(props.item, props.itemIndex, $event)"
                        @dblclick="handleDbclick(props.item, props.itemIndex, $event)"
                        @contextmenu="handleContextmenu(props.item, props.itemIndex, $event)"
                >
                    <gk-table-cell @check="handleCheck" :is-checked="checked[props.itemIndex] !== undefined" :index="props.itemIndex" :data="props.item" :column="column" v-for="(column, idx) in columns" :key="idx"></gk-table-cell>
                </tr>
            </template>
        </virtual-scroller>
        <div v-if="showMore" class="gk-table-more">
            <span class="gk-table-more-text">{{moreText}}</span>
        </div>
    </section>
</template>

<script>
  import {VirtualScroller} from 'vue-virtual-scroller';
  import GkTableCell from "gokuai-components/packages/table/src/table-cell";
  import loading from 'gokuai-components/packages/loading/src/loading';
  import scrollLoad from 'gokuai-components/packages/scroll-load/src/scroll-load';

  export default {
    name: "GkTable",
    directives: {loading, scrollLoad},
    components: {GkTableCell, VirtualScroller},
    props: {
      'show-more': Boolean,
      'show-header': Boolean,
      'show-checkbox': Boolean,
      'default-index': Number|Array,
      'default-checked-index': {
        type: Array,
        default: () => []
      },
      'more-text': {
        type: String,
        default: 'loading...'
      },
      height: Number,
      loading: Boolean,
      fit: Boolean,
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
      let selected = {}, checked = {};
      if (typeof this.defaultIndex === 'object') {
        this.defaultIndex.forEach((index) => {
          selected[index] = this.data[index];
        });
      } else {
        selected[this.defaultIndex] = this.data[this.defaultIndex];
      }
      this.defaultCheckedIndex.forEach((index) => {
        checked[index] = this.data[index];
      });
      return {
        page: 1,
        selected: selected,
        lastSelectedIndex: -1,
        checked: checked,
        showAllCheckbox: false,
        hasScrollbar: false,
        clickTimer: false,
        clickItem: false
      }
    },
    computed: {
      computedStyle() {
        let style = {};
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
      loadMore(page) {
        this.$emit('loadMore', page);
      },
      handleSelect(item, index, event) {
        this.clickItem = true;
        clearTimeout(this.clickTimer);
        this.clickTimer = setTimeout(() => {
          if (event && (event.ctrlKey || event.metaKey)) {
            let selected = this.selected;
            this.selected = {};
            if (selected[index] === undefined) {
              selected[index] = item;
              this.selected = selected;
              this.lastSelectedIndex = index;
              this.$emit('select', item, index, event);
            } else {
              delete selected[index];
              this.selected = selected;
              this.$emit('select', null, null, event);
            }
          } else  {
            this.selected = {};
            if (event && event.shiftKey && this.lastSelectedIndex > -1) {
              for (let i = Math.min(index, this.lastSelectedIndex); i <= Math.max(index, this.lastSelectedIndex); i++) {
                this.selected[i] = this.data[i];
              }
            } else {
              if (this.selected[index] !== undefined) {
                return;
              }
              this.selected[index] = item;
              this.lastSelectedIndex = index;
              this.$emit('select', item, index, event);
            }
          }
          this.clickItem = false;
        }, 20);
      },
      handleCancelSelect() {
        if (this.clickItem) {
          return;
        }
        this.selected = {};
        this.$emit('select', null, null, event);
      },
      handleSelectAll() {
        let selected = {};
        for (let i in this.data) {
          selected[i] = this.data[i];
        }
        this.selected = selected;
      },
      handleDbclick(item, index, event) {
        clearTimeout(this.clickTimer);
        this.$emit('dblclick', item, index, event);
      },
      handleCheck(item, index, {target}) {
        if (target.checked) {
          this.checked[index] = item;
        } else {
          delete this.checked[index];
        }
        !this.showCheckbox && (this.showAllCheckbox = Object.keys(this.checked).length > 0);
      },
      handleCheckAll(checked) {
        let checkboxs = this.$refs.table.$el.querySelectorAll('.gk-table-checkbox > :first-child');
        for (let i = 0; i < checkboxs.length; i++) {
          checkboxs[i].checked = checked;
          if (checked) {
            checkboxs[i].classList.add('gk-checkbox-checked');
          } else {
            checkboxs[i].classList.remove('gk-checkbox-checked');
          }
        }
        if (checked) {
          this.checked = this.data;
        } else {
          this.checked = [];
        }
      },
      handleContextmenu(item, index, event) {
        if (Object.keys(this.$listeners).indexOf('contextmenu') === -1) {
          return;
        }
        this.$emit('contextmenu', item, index, event);
        event.stopPropagation();
        event.preventDefault();
      },
      handleSelectPrevNext(offset) {
        let keys = Object.keys(this.selected);
        if (keys.length !== 1) {
          return false;
        }
        let index = parseInt(keys[0]) + offset;
        if (index < 0 || index > this.data.length - 1) {
          return false;
        }
        this.handleSelect(this.data[index], index);
      },
      setScrollbar() {
        let el = this.$refs.table.$el;
        this.hasScrollbar = this.itemHeight * this.data.length > el.clientHeight;
      },
      watchScrollbar() {
        this.setScrollbar();
        let timer = 0;
        window.addEventListener('resize', () => {
          clearTimeout(timer);
          timer = setTimeout(() => {
            this.setScrollbar();
          }, 5);
        });
      },
      getSelected() {
        return Object.values(this.selected);
      },
      getSelectedIndex() {
        return Object.keys(this.selected);
      },
      getChecked() {
        return Object.values(this.checked);
      }
    },
    mounted() {
      this.watchScrollbar();
      document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.code === 'KeyA') {
          this.handleSelectAll();
          e.preventDefault();
        } else if (e.code === 'ArrowUp') {
          this.handleSelectPrevNext(-1)
        } else if (e.code === 'ArrowDown') {
          this.handleSelectPrevNext(+1)
        }
      });
    }
  }
</script>