<template>
    <ul class="gk-thumbnail" @click="handleCancelSelect" @contextmenu="handleContextmenu(null, null, $event)" :class="{'gk-thumbnail-fit': fit}" v-loading="loading">
        <gk-thumbnail-item
                @click.native="handleSelect(item, index, $event)"
                @dblclick.native="handleDblclick(item, index, $event)"
                @contextmenu.native="handleContextmenu(item, index, $event)"
                v-for="(item, index) in data"
                :key="index"
                :data="item"
                :render="$scopedSlots.default"
                :property="property"
                :size="size"
                :class="{'gk-thumbnail-active-item':selected[index] !== undefined}"
                :style="style"
        ></gk-thumbnail-item>
    </ul>
</template>

<script>
  import GkThumbnailItem from "./thumbnail-item.js";
  import loading from '../../loading/src/loading';

  export default {
    name: "GkThumbnail",
    directives: {loading},
    components: {GkThumbnailItem},
    props: {
      data: Array,
      property: String,
      size: Object,
      border: Number,
      'default-index': Number|Array,
      loading: Boolean,
      fit: Boolean
    },
    data() {
      let selected = {};
      if (typeof this.defaultIndex === 'object') {
        this.defaultIndex.forEach((index) => {
          selected[index] = this.data[index];
        });
      } else {
        selected[this.defaultIndex] = this.data[this.defaultIndex];
      }
      return {
        clickTimer: false,
        selected: selected,
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
    methods: {
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
          return false;
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
      handleDblclick(data, index, event) {
        clearTimeout(this.clickTimer);
        this.$emit('dblclick', data, index, event);
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
      getSelected() {
        return Object.values(this.selected);
      },
      getSelectedIndex() {
        return Object.keys(this.selected);
      }
    },
    mounted() {
      document.onkeydown = (e) => {
        if ((e.ctrlKey || e.metaKey) && e.code === 'KeyA') {
          this.handleSelectAll();
          e.preventDefault();
        } else if (e.code === 'ArrowLeft') {
          this.handleSelectPrevNext(-1)
        } else if (e.code === 'ArrowRight') {
          this.handleSelectPrevNext(+1)
        }
      };
    }
  }
</script>