<template>
  <section class="gk-table" :style="tableStyle"
           :class="{'gk-table-with-header':showHeader, 'gk-table-fit': fit, 'gk-table-show-checkbox': showCheckbox}">
    <table ref="thead" class="gk-table-header" v-show="showHeader">
      <thead>
      <tr>
        <slot></slot>
        <th v-if="hasScrollbar" class="gk-table-header-last"></th>
      </tr>
      </thead>
    </table>
    <div @contextmenu="handleContextmenu(null, null, $event)"
         :style="computedStyle"
         v-scroll-load="loadMore" v-loading="loading" ref="table"
         class="gk-table-body gk-scrollbar" :class="{'gk-no-scrollbar': touchEnable}"
         @click="handleCancelSelect()">
      <table v-if="data.length || loading">
        <tbody>
        <tr
            v-for="(item, index) in data"
            :key="index"
            class="gk-table-item"
            :class="Object.assign(computedClass, {'is-active':selected[index] !== undefined})"
            @click="handleSelect(item, index, $event)"
            @dblclick="handleDoubleClick(item, index, $event)"
            @contextmenu="handleContextmenu(item, index, $event)"
            v-touch:tap.prevent="($event) => handleTap(index, $event)"
        >
          <gk-table-cell @check="handleCheck" :is-checked="checked[index] !== undefined"
                         :index="index" :data="item" :column="column"
                         v-for="(column, idx) in columns" :key="idx"/>
        </tr>
        </tbody>
      </table>
      <div v-else class="gk-table-empty">
        <slot name="empty"></slot>
      </div>
    </div>
    <div v-if="showMore" class="gk-table-more">
      <span class="gk-table-more-text">{{moreText}}</span>
    </div>
  </section>
</template>

<script>
  import GkTableMixin from "gokuai-components/packages/table/src/table-mixin";
  import GkTableCell from "gokuai-components/packages/table/src/table-cell";
  import touch from 'gokuai-components/packages/touch/src/touch';

  export default {
    name: "GkTable",
    mixins: [GkTableMixin],
    directives: {touch},
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
      }
    },
    data() {
      return {
        touchEnable: touch.enable,
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
      computedClass() {
        return typeof this.itemClass === 'string' ? {[this.itemClass]:true} : this.itemClass || {};
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
      setScrollbar() {
        if (!this.$refs.table) {
          return;
        }
        let table = this.$refs.table;
        this.hasScrollbar = table.children[0].clientHeight > table.clientHeight;
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
        if (e.keyCode === 38) { //arrow up
          this.handleSelectPrevNext(-1, e);
          e.preventDefault();
        } else if (e.keyCode === 40) { //arrow down
          this.handleSelectPrevNext(+1, e);
          e.preventDefault();
        } else if (e.keyCode === 13) { //enter
          this.handleDoubleClick(Object.values(this.selected)[0], Object.keys(this.selected)[0], e);
          e.preventDefault();
        }
      },
      getColumns() {
        let columns = [];
        this.$children.forEach((column) => {
          if (column.isTableColumn) {
            columns.push(Object.assign({
              columnStyle: column.columnStyle,
              render: column.$scopedSlots.default
            }, column.$props));
          } else {
            return false;
          }
        });
        if (JSON.stringify(this.columns) !== JSON.stringify(columns)) {
          this.columns = columns;
        }
      }
    },
    mounted() {
      this.getColumns();
      this.$nextTick(() => {
        this.setScrollbar();
      });
      window.addEventListener('resize', this.windowResize);
    },
    updated() {
      this.getColumns();
      this.setScrollbar();
    },
    destroyed() {
      window.removeEventListener('resize', this.windowResize);
    }
  }
</script>