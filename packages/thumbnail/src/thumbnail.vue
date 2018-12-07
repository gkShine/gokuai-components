<template>
  <section class="gk-thumbnail" :class="{'gk-thumbnail-with-header': checkbox}">
    <div class="gk-thumbnail-header">
      <gk-checkbox @change="handleCheckAll">{{gettext('all')}}</gk-checkbox>
    </div>
    <template v-show="data.length">
      <ul ref="thumbnail" class="gk-thumbnail-list gk-scrollbar" @click="handleCancelSelect"
          @contextmenu="handleContextmenu(null, null, $event)"
          :class="{'gk-thumbnail-fit': fit, 'gk-thumbnail-checkbox': showCheckbox, 'gk-no-scrollbar': touchEnable}" v-loading="loading"
          v-scroll-load="loadMore">
        <gk-thumbnail-item
            :checkbox="checkbox"
            @click.native="handleSelect(item, index, $event)"
            @dblclick.native="handleDoubleClick(item, index, $event)"
            @contextmenu.native="handleContextmenu(item, index, $event)"
            @change-checked="handleCheck(item, index, $event)"
            v-touch:tap.stop.prevent="($event) => handleTap(item, index, $event)"
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
    <div v-if="!loading && !data.length" :class="{'gk-thumbnail-fit': fit}">
      <div class="gk-thumbnail-empty">
        <slot name="empty"></slot>
      </div>
    </div>
  </section>
</template>

<script>
  import GkTableMixin from "gokuai-components/packages/table/src/table-mixin";
  import GkCheckbox from "gokuai-components/packages/checkbox/src/checkbox";
  import GkThumbnailItem from "gokuai-components/packages/thumbnail/src/thumbnail-item";
  import touch from 'gokuai-components/packages/touch/src/touch';

  export default {
    name: "GkThumbnail",
    mixins: [GkTableMixin],
    directives: {touch},
    components: {GkThumbnailItem, GkCheckbox},
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
          return {w: 128, h: 128};
        }
      }
    },
    data() {
      return {
        touchEnable: touch.enable
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
        if (e.keyCode === 37) { //arrow left
          this.handleSelectPrevNext(-1, e);
          e.preventDefault();
        } else if (e.keyCode === 39) { //arrow right
          this.handleSelectPrevNext(+1, e);
          e.preventDefault();
        } else if (e.keyCode === 38) { //arrow up
          this.handleSelectPrevNext(-this.getLineSize(), e);
          e.preventDefault();
        } else if (e.keyCode === 40) { //arrow down
          this.handleSelectPrevNext(+this.getLineSize(), e);
          e.preventDefault();
        } else if (e.keyCode === 13) { //enter
          this.handleDoubleClick(Object.values(this.selected)[0], Object.keys(this.selected)[0], e);
          e.preventDefault();
        }
      }
    }
  }
</script>