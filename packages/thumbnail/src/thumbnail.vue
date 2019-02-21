<template>
  <section class="gk-thumbnail" :class="{'gk-thumbnail-with-header': checkbox}">
    <div class="gk-thumbnail-header">
      <gk-checkbox @change="handleCheckAll">{{gettext('all')}}</gk-checkbox>
    </div>
    <template v-show="data.length">
      <ul ref="thumbnail"
          class="gk-thumbnail-list gk-scrollbar"
          @click="handleCancelSelect"
          @contextmenu="handleContextmenu(null, null, $event)"
          :class="{'gk-thumbnail-fit': fit, 'gk-thumbnail-checkbox': showCheckbox, 'gk-no-scrollbar': touchEnable}"
          v-scroll-load="loadMore"
          v-loading="loading"
          :gk-loading-class="loadingClass">
        <gk-thumbnail-item
            :checkbox="checkbox"
            @click.native="handleSelect(item, index, $event)"
            @dblclick.native="handleDoubleClick(item, index, $event)"
            @contextmenu.native="handleContextmenu(item, index, $event)"
            @change-checked="handleCheck(item, index, $event)"
            v-touch:tap.prevent="($event) => handleTap(index, $event)"
            v-for="(item, index) in data"
            :key="index"
            :data="item"
            :render="$scopedSlots.default"
            :property="property"
            :size="itemSize"
            :item-class="itemClass"
            :is-checked="checked[index] !== undefined"
            :class="{'is-active':selected[index] !== undefined, 'is-noborder': !border}"
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
      showMore: Boolean,
      moreText: {
        type: String,
        default: 'loading...'
      },
      border: {
        type: Boolean,
        default: true
      },
      data: Array,
      property: String,
      checkbox: Boolean,
      adaptive: {
        type: Boolean,
        default: touch.device.mobile
      },
      size: [Object, Number],
      sizeScope: {
        type: Array,
        default: () => [128, 192, 256, 320, 384, 448, 512]
      }
    },
    data() {
      return {
        timer: 0,
        touchEnable: touch.enable,
        itemSize: this.size || this.sizeScope[0],
        lockData: {}
      };
    },
    watch: {
      size: 'updateItemSize'
    },
    methods: {
      getLineSize(detail) {
        let el = this.$refs.thumbnail;
        if (!el.childNodes.length) {
          return 0;
        }
        let child = el.childNodes[0];
        const scopeWidth = el.clientWidth - parseInt(window.getComputedStyle(el).paddingLeft) - parseInt(window.getComputedStyle(el).paddingRight);
        const itemWidth = child.clientWidth + parseInt(window.getComputedStyle(child).marginLeft) + parseInt(window.getComputedStyle(child).marginRight);
        const lineCount = parseInt(scopeWidth / itemWidth)
        if (detail) {
          return {
            scopeWidth,
            itemWidth,
            lineCount
          };
        } else {
          return lineCount;
        }
      },
      checkLock() {
        const lockData = {
          size: this.itemSize,
          count: this.data.length
        };
        if (JSON.stringify(lockData) !== JSON.stringify(this.lockData)) {
          this.lockData = lockData;
          return true;
        } else {
          return false;
        }
      },
      updateItemSize(value) {
        this.itemSize = value instanceof Object ? value : parseInt(value);
      },
      relocate() {
        if (!this.adaptive || !this.$refs.thumbnail.childNodes.length || !this.checkLock()) {
          return false;
        }
        const child = this.$refs.thumbnail.childNodes[0];
        child.style.marginLeft = child.style.marginRight = null;
        const {scopeWidth, itemWidth, lineCount} = this.getLineSize(true);
        const margin = parseInt(scopeWidth - itemWidth * lineCount) / lineCount / 2
          + parseInt(window.getComputedStyle(child).marginLeft) - 1;
        this.$refs.thumbnail.querySelectorAll('.gk-thumbnail-item').forEach((dom) => {
          dom.style.marginLeft = dom.style.marginRight = margin + 'px';
        })
      },
      zoom(size) {
        const list = this.sizeScope;
        switch (size) {
          case 'in':
            this.itemSize = list[list.indexOf(this.itemSize) + 1] || this.itemSize;
            break;
          case 'out':
            this.itemSize = list[list.indexOf(this.itemSize) - 1] || this.itemSize;
            break;
          default:
            if (list.indexOf(size) > -1) {
              this.itemSize = size;
            }
        }
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
      },
      handleWindowResize() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.relocate();
        }, 100);
      }
    },
    mounted() {
      if (this.adaptive) {
        this.$nextTick(() => {
          this.relocate();
        });
        window.addEventListener('resize', this.handleWindowResize);
      }
    },
    updated() {
      if (this.adaptive) {
        this.$nextTick(() => {
          this.relocate();
        });
      }
    },
    destroyed() {
      this.adaptive && window.removeEventListener('resize', this.handleWindowResize);
    }
  }
</script>