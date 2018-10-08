<template>
  <section class="gk-thumbnail gk-scrollbar" :class="{'gk-thumbnail-fit': fit}">
    <template v-if="data.length">
      <ul ref="thumbnail" class="gk-thumbnail-list" @click="handleCancelSelect"
          @contextmenu="handleContextmenu(null, null, $event)"
          :class="{'gk-thumbnail-checkbox': showCheckbox}" v-loading="loading"
          v-scroll-load="loadMore">
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
      <div v-if="showMore" class="gk-thumbnail-more">
        <span class="gk-thumbnail-more-text">{{moreText}}</span>
      </div>
    </template>
    <div v-else class="gk-thumbnail-empty">
      <slot name="empty"></slot>
    </div>
  </section>
</template>

<script>
  import GkTableMixin from "gokuai-components/packages/table/src/table-mixin";
  import GkThumbnailItem from "gokuai-components/packages/thumbnail/src/thumbnail-item";

  export default {
    name: "GkThumbnail",
    mixins: [GkTableMixin],
    components: {GkThumbnailItem},
    props: {
      'show-more': Boolean,
      'more-text': {
        type: String,
        default: 'loading...'
      },
      data: Array,
      property: String,
      border: Number,
      checkbox: Boolean,
      size: {
        type: Object,
        default: () => {
          return {w: 148, h: 180};
        }
      }
    },
    data() {
      return {};
    },
    computed: {
      style() {
        return {
          border: this.border + 'px'
        };
      }
    },
    methods: {
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
      documentKeyDown(e) {
        if (this.handleShortcut(e) === false) {
          return false;
        }
        if (e.code === 'ArrowLeft') {
          this.handleSelectPrevNext(-1, e)
          e.preventDefault();
        } else if (e.code === 'ArrowRight') {
          this.handleSelectPrevNext(+1, e)
          e.preventDefault();
        } else if (e.code === 'ArrowUp') {
          this.handleSelectPrevNext(-this.getLineSize(), e);
          e.preventDefault();
        } else if (e.code === 'ArrowDown') {
          this.handleSelectPrevNext(+this.getLineSize(), e);
          e.preventDefault();
        } else if (e.code === 'Enter') {
          this.handleDbclick(Object.values(this.selected)[0], Object.keys(this.selected)[0], e);
          e.preventDefault();
        }
      }
    }
  }
</script>