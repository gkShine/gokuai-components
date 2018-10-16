<template>
  <section class="gk-table" :style="tableStyle"
           :class="{'gk-table-with-header':showHeader, 'gk-table-fit': fit, 'gk-table-show-checkbox': showCheckbox}">
    <template v-show="data.length">
      <table ref="thead" class="gk-table-header" v-show="showHeader">
        <thead>
        <tr>
          <slot></slot>
          <th v-if="hasScrollbar" class="gk-table-header-last"></th>
        </tr>
        </thead>
      </table>
      <div @contextmenu.native="handleContextmenu(null, null, $event)"
           :style="computedStyle"
           v-scroll-load="loadMore" v-loading="loading" ref="table"
           class="gk-table-virtual gk-scrollbar"
           @click.native="handleCancelSelect()">
        <table class="gk-table-body">
          <tbody>
          <tr
              v-for="(item, index) in data"
              :key="index"
              class="gk-table-item"
              :class="{'gk-table-item-active':selected[index] !== undefined}"
              @click="handleSelect(item, index, $event)"
              @dblclick="handleDblclick(item, index, $event)"
              @contextmenu="handleContextmenu(item, index, $event)"
          >
            <gk-table-cell @check="handleCheck" :is-checked="checked[index] !== undefined"
                           :index="index" :data="item" :column="column"
                           v-for="(column, idx) in columns" :key="idx"/>
          </tr>
          </tbody>
        </table>
      </div>
      <div v-if="showMore" class="gk-table-more">
        <span class="gk-table-more-text">{{moreText}}</span>
      </div>
    </template>
    <div v-if="!data.length" class="gk-table-empty">
      <slot name="empty"></slot>
    </div>
  </section>
</template>

<script>
  import GkTableMixin from "gokuai-components/packages/table/src/table-mixin";
  import GkTableCell from "gokuai-components/packages/table/src/table-cell";

  export default {
    name: "GkTable",
    mixins: [GkTableMixin],
    components: {GkTableCell},
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
        columns: [],
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
        this.$children.forEach((child) => {
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
        this.hasScrollbar = this.itemHeight * this.data.length > this.$refs.table.clientHeight;
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
      },
      getColumns() {
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
    mounted() {
      this.columns = this.getColumns();
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