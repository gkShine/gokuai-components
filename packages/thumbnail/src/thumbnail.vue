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
      'default-index': Number,
      loading: Boolean,
      fit: Boolean
    },
    data() {
      return {
        clickTimer: false,
        selected: {}
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
        clearTimeout(this.clickTimer);
        this.clickTimer = setTimeout(() => {
          if (event.ctrlKey || event.metaKey) {
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
            if (event.shiftKey && this.lastSelectedIndex > -1) {
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
        }, 20);
        event.stopPropagation();
      },
      handleCancelSelect() {
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
      }
    },
    mounted() {
      document.onkeydown = (e) => {
        if ((e.ctrlKey || e.metaKey) && e.code === 'KeyA') {
          this.handleSelectAll();
          e.preventDefault();
        }
      };

      if (this.data) {
        this.selected[this.defaultIndex] = this.data[this.defaultIndex];
      }
    }
  }
</script>