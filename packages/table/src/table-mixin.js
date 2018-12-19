import loading from "gokuai-components/packages/loading/src/loading";
import scrollLoad from 'gokuai-components/packages/scroll-load/src/scroll-load';
import {intersect, getSelected, debounce} from "gokuai-components/src/common/util";
import touch from 'gokuai-components/packages/touch/src/touch';

export default {
  directives: {loading, scrollLoad},
  props: {
    loading: Boolean,
    fit: Boolean,
    shortcut: Boolean,
    translate: Object,
    'right-selected': Boolean,
    'show-checkbox': Boolean,
    'before-select': Function,
    'scroll-on-check': Boolean,
    'scroll-on-select': Boolean,
    'item-class': String|Object,
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
    let selected = getSelected(this.defaultIndex, this.data);
    let checked = getSelected(this.defaultCheckedIndex, this.data);
    if (this.checkOnSelect) {
      selected = Object.assign(selected, checked);
    }
    if (this.selectOnCheck) {
      checked = Object.assign(checked, selected);
    }
    return {
      scrollCheckAll: false,
      scrollSelectAll: false,
      lastSelectedIndex: -1,
      lastIndex: -1,
      clickTimer: false,
      clickItem: false,
      selected: selected,
      checked: checked
    }
  },
  watch: {
    data: 'updateData'
  },
  methods: {
    gettext(value) {
      return this.translate && this.translate[value] || value;
    },
    handleTap(index, event) {
      if (typeof this.beforeSelect === 'function' && !this.beforeSelect(this.data[index], index, event)) {
        return false;
      }
      clearTimeout(this.clickTimer);
      this.$emit('tap', this.data[index], event);
    },
    handleSelect(item, index, event, callback) {
      if (Object.keys(this.$listeners).indexOf('tap') > -1 && touch.enable) {
        return false;
      }
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
          } else {
            delete selected[index];
            this.selected = selected;
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
          }
        }
        this.clickItem = false;
        this.lastIndex = index;
        this.updateChecked();
        this.$emit('select', this.getSelected(), event);
        callback && callback();
      }, 20);
    },
    handleCancelSelect(event) {
      if (this.clickItem || touch.enable) {
        return;
      }
      this.selected = {};
      this.lastIndex = -1;
      this.updateChecked();
      this.$emit('select', null, event);
    },
    handleDoubleClick(item, index, event) {
      clearTimeout(this.clickTimer);
      this.$emit('doubleClick', item, event);
    },
    handleCheck(item, index, event) {
      if (event.target.checked) {
        this.checked[index] = item;
      } else {
        delete this.checked[index];
      }
      this.refreshCheckAllState();
      if (this.checkOnSelect || this.selectOnCheck) {
        this.updateSelected(index);
        event.stopPropagation();
      }
      this.$emit('check', this.getChecked(), event);
    },
    handleContextmenu(item, index, event) {
      if (Object.keys(this.$listeners).indexOf('contextmenu') === -1) {
        return;
      }
      let emit = () => this.$emit('contextmenu', this.getSelected(), event);
      if (item === null) {
        this.handleCancelSelect(event);
        emit();
      } else if (this.rightSelected && this.selected[index] === undefined) {
        this.handleSelect(item, index, event, emit);
      } else {
        emit();
      }
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
    handleSelectAll() {
      this.selected = Object.assign({}, this.data);
      this.lastIndex = this.data.length - 1;
      this.updateChecked();
      this.$emit('selectAll', event);
    },
    handleCheckAll(checked) {
      if (checked) {
        this.checked = Object.assign({}, this.data);
      } else {
        this.checked = [];
      }
      this.updateSelected(this.checked.length - 1);
      this.$emit('checkAll', event);
    },
    handleShortcut(e) {
      if ((e.ctrlKey || e.metaKey) && e.keyCode === 65) { //ctrl+a || meta+a
        this.handleSelectAll();
        e.preventDefault();
        return false;
      } else if (e.keyCode === 33) { //PgUp
        this.handleSelect(this.data[0], 0, e);
        e.preventDefault();
      } else if (e.keyCode === 35 || e.keyCode === 34) { //End || PgDn
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
    select(item, index) {
      if (this.selected[index] !== undefined) {
        return;
      }
      this.selected = {};
      this.selected[index] = item;
      this.lastSelectedIndex = index;
      this.updateChecked();
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