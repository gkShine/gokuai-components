<template>
    <ul class="gk-thumbnail" :class="{'gk-thumbnail-fit': fit}" v-loading="loading">
        <gk-thumbnail-item
                @click.native="selectItem(dat, idx, $event)"
                @dblclick.native="dblclickItem(dat, idx, $event)"
                v-for="(dat, idx) in data"
                :key="idx"
                :data="dat"
                :render="$scopedSlots.default"
                :property="property"
                :size="size"
                :class="{'gk-thumbnail-active-item':idx === selectedInx}"
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
      'selected-index': Number,
      loading: Boolean,
      fit: Boolean
    },
    data() {
      return {
        clickTimer: false,
        selectedInx: this.selectedIndex,
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
      selectItem(item, index, event) {
        clearTimeout(this.clickTimer);
        this.clickTimer = setTimeout(() => {
          this.selected = item;
          this.selectedInx = index;
          this.$emit('select', item, index, event);
        }, 20);
      },
      dblclickItem(data, index, event) {
        clearTimeout(this.clickTimer);
        this.$emit('dblclick', data, index, event);
      }
    }
  }
</script>