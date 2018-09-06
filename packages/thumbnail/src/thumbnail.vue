<template>
    <ul ref="thumbnail" class="gk-thumbnail gk-scrollbar" @click="handleCancelSelect" @contextmenu="handleContextmenu(null, null, $event)" :class="{'gk-thumbnail-fit': fit, 'gk-thumbnail-checkbox': showCheckbox}" v-loading="loading" v-scroll-load="loadMore">
        <gk-thumbnail-item
                :checkbox="checkbox"
                @click.native="handleSelect(item, index, $event)"
                @dblclick.native="handleDblclick(item, index, $event)"
                @contextmenu.native="handleContextmenu(item, index, $event)"
                @change-checked="handleCheck(item, index, $event)"
                v-for="(item, index) in data"
                :key="index"
                :data="item"
                :render="$scopedSlots.default"
                :property="property"
                :size="size"
                :is-checked="checked[index] !== undefined"
                :class="{'gk-thumbnail-active-item':selected[index] !== undefined}"
                :style="style"
        ></gk-thumbnail-item>
    </ul>
</template>

<script>
  import GkThumbnailItem from "gokuai-components/packages/thumbnail/src/thumbnail-item";
  import loading from "gokuai-components/packages/loading/src/loading";
  import scrollLoad from 'gokuai-components/packages/scroll-load/src/scroll-load';
  import {intersect, getSelected} from "gokuai-components/src/common/util";

  export default {
    name: "GkThumbnail",
    directives: {loading, scrollLoad},
    components: {GkThumbnailItem},
    props: {
      data: Array,
      property: String,
      size: {
        type: Object,
        default: () => {
          return {w: 148, h: 180};
        }
      },
      border: Number,
      'default-index': Number|Array,
      'default-checked-index': {
        type: Number | Array,
        default: () => []
      },
      loading: Boolean,
      fit: Boolean,
      shortcut: Boolean,
      beforeSelect: Function,
      'show-checkbox': Boolean,
      checkbox: Boolean,
      'select-on-check': {
        type: Boolean,
        default: true
      },
      'check-on-select': {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        clickTimer: false,
        lastSelectedIndex: -1,
        lastIndex: -1,
        selected: getSelected(this.defaultIndex, this.data),
        checked: getSelected(this.defaultCheckedIndex, this.data),
        clickItem: false
      };
    },
    computed: {
      style() {
        return {
          border: this.border + 'px'
        };
      }
    },
    watch: {
      data: 'updateData'
    },
    methods: {
      updateData() {
        this.selected = intersect(this.selected, this.data);
      },
      loadMore() {
        this.$emit('loadMore');
      },
      handleSelect(item, index, event) {
        if (typeof this.beforeSelect === 'function' && !this.beforeSelect(item, index, event)) {
          return false;
        }
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
          this.lastIndex = index;
          this.updateChecked();
        }, 20);
      },
      handleCancelSelect() {
        if (this.clickItem) {
          return false;
        }
        this.selected = {};
        this.lastIndex = -1;
        this.$emit('select', null, null, event);
        this.updateChecked();
      },
      handleSelectAll() {
        this.selected = Object.assign({}, this.data);
        this.lastIndex = this.data.length - 1;
        this.updateChecked();
      },
      handleDblclick(data, index, event) {
        clearTimeout(this.clickTimer);
        this.$emit('dblclick', data, index, event);
      },
      handleCheck(item, index, event) {
        if (event.target.checked) {
          this.checked[index] = item;
        } else {
          delete this.checked[index];
        }
        let checked = Object.values(this.checked);
        this.$emit('check', checked, event);
        if (this.checkOnSelect || this.selectOnCheck) {
          this.updateSelected(index);
          console.log(event);
          event.stopPropagation();
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
      handleSelectPrevNext(offset, event) {
        if (this.lastIndex === -1) {
          return false;
        }
        let index = parseInt(this.lastIndex) + offset;
        if (index < 0 || index > this.data.length - 1) {
          return false;
        }
        this.handleSelect(this.data[index], index, event);
      },
      getLineSize() {
        let el = this.$refs.thumbnail;
        if (!el.childNodes.length) {
            return 0;
        }
        let child = el.childNodes[0];
        return parseInt(
          (el.clientWidth - parseInt(window.getComputedStyle(el).padding) * 2)
          / (child.clientWidth + parseInt(window.getComputedStyle(child).margin) * 2)
        );
      },
      updateChecked() {
        if (!this.selectOnCheck) {
          return;
        }
        this.checked = Object.assign({}, this.selected);
      },
      updateSelected(index) {
        if (!this.checkOnSelect) {
          return;
        }
        this.selected = Object.assign({}, this.checked);
        this.lastIndex = index;
      },
      getSelected() {
        return Object.values(this.selected);
      },
      getSelectedIndex() {
        return Object.keys(this.selected);
      },
      getChecked() {
        return Object.values(this.checked);
      },
      getCheckedIndex() {
        return Object.keys(this.checked);
      },
      documentKeyDown(e) {
        if ((e.ctrlKey || e.metaKey) && e.code === 'KeyA') {
          this.handleSelectAll();
          e.preventDefault();
          return false;
        } else if (e.code === 'PgUp') {
          this.handleSelect(this.data[0], 0, e);
          e.preventDefault();
        } else if (e.code === 'End' || e.code === 'PgDn') {
          this.handleSelect(this.data[this.data.length - 1], this.data.length - 1, e);
          e.preventDefault();
        }
        if (!Object.keys(this.selected).length) {
          return false;
        }
        if (e.code === 'ArrowLeft') {
          this.handleSelectPrevNext(-1, e)
        } else if (e.code === 'ArrowRight') {
          this.handleSelectPrevNext(+1, e)
        } else if (e.code === 'ArrowUp') {
          this.handleSelectPrevNext(-this.getLineSize(), e);
        } else if (e.code === 'ArrowDown') {
          this.handleSelectPrevNext(+this.getLineSize(), e);
        }
        e.preventDefault();
      }
    },
    mounted() {
      this.shortcut && document.addEventListener('keydown', this.documentKeyDown);
    },
    destroyed() {
      this.shortcut && document.removeEventListener('keydown', this.documentKeyDown);
    }
  }
</script>