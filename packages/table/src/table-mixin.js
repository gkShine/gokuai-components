import loading from "gokuai-components/packages/loading/src/loading";
import scrollLoad from 'gokuai-components/packages/scroll-load/src/scroll-load';
import {intersect, getSelected} from "gokuai-components/src/common/util";

export default {
  directives: {loading, scrollLoad},
  props: {
    loading: Boolean,
    fit: Boolean,
    shortcut: Boolean,
    'right-selected': Boolean,
    'show-checkbox': Boolean,
    'before-select': Function,
    'scroll-on-check': Boolean,
    'scroll-on-select': Boolean,
    'default-index': Number | Array,
    'default-checked-index': {
      type: Number | Array,
      default: () => []
    },
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
      scrollCheckAll: false,
      scrollSelectAll: false,
      lastSelectedIndex: -1,
      lastIndex: -1,
      clickTimer: false,
      clickItem: false,
      selected: getSelected(this.defaultIndex, this.data),
      checked: getSelected(this.defaultCheckedIndex, this.data)
    }
  },
  watch: {
    data: 'updateData'
  },
  methods: {
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
            this.lastSelectedIndex = index;
            this.selected = selected;
            this.$emit('select', item, index, event);
          } else {
            delete selected[index];
            this.selected = selected;
            this.$emit('select', null, null, event);
          }
        } else {
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
    handleCancelSelect(event) {
      if (this.clickItem) {
        return;
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
      this.refreshCheckAllState();
      this.$emit('check', checked, event);
      if (this.checkOnSelect || this.selectOnCheck) {
        this.updateSelected(index);
        event.stopPropagation();
      }
    },
    handleContextmenu(item, index, event) {
      if (Object.keys(this.$listeners).indexOf('contextmenu') === -1) {
        return;
      }
      if (this.rightSelected && this.selected[index] === undefined) {
        this.handleSelect(item, index, event);
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
    handleCheckAll(checked) {
      let checkboxes = this.getCheckboxes();
      checkboxes.forEach((checkbox) => {
        checkbox.setChecked(checked);
      });
      if (checked) {
        this.checked = this.data;
      } else {
        this.checked = [];
      }
      this.$emit('check', Object.values(this.checked), event);
      this.updateSelected(this.checked.length - 1);
    },
    handleShortcut(e) {
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
    },
    loadMore() {
      if (this.scrollOnCheck) {
        this.scrollCheckAll = Object.keys(this.checked).length === this.data.length;
      }
      if (this.scrollOnSelect) {
        this.scrollSelectAll = Object.keys(this.selected).length === this.data.length;
      }
      this.$emit('load-more');
    },
    refreshCheckAllState() {
      return false;
    },
    updateChecked() {
      if (!this.selectOnCheck) {
        return;
      }
      this.checked = Object.assign({}, this.selected);
      this.refreshCheckAllState();
    },
    updateSelected(index) {
      if (!this.checkOnSelect) {
        return;
      }
      this.selected = Object.assign({}, this.checked);
      this.lastIndex = index;
    },
    updateData() {
      this.checked = intersect(this.checked, this.data);
      this.selected = intersect(this.selected, this.data);
      if (this.scrollOnCheck && this.scrollCheckAll) {
        this.scrollCheckAll = false;
        this.handleCheckAll(true);
      }
      if (this.scrollOnSelect && this.scrollSelectAll) {
        this.scrollSelectAll = false;
        this.selected = this.data;
      }
      this.refreshCheckAllState();
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
    }
  },
  mounted() {
    this.shortcut && document.addEventListener('keydown', this.documentKeyDown);
  },
  destroyed() {
    this.shortcut && document.removeEventListener('keydown', this.documentKeyDown);
  }
};