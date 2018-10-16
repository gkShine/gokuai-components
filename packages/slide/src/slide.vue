<template>
    <section class="gk-slide" :class="{'gk-slide-fit': fit, 'gk-slide-with-toolbar': toolbar}">
        <div class="gk-slide-content">
            <slot :item="selected" v-if="Object.keys($scopedSlots).length"></slot>
            <div v-else class="gk-slide-images">
                <img :src="selected" />
            </div>
        </div>
        <div class="gk-slide-toolbar" v-if="toolbar">
            <div class="gk-slide-toolbar-left">
                <i :class="btn.icon" placement="top" v-tooltip :title="btn.title" v-for="(btn, idx) in left" :key="idx" @click="handleBtn(btn)"></i>
            </div>
            <div class="gk-slide-toolbar-center">
                <i v-if="center.prev" placement="top" v-tooltip :title="center.prev" class="gk-icon-angleleft" :class="{'gk-disable': selectedIndex === 0}" @click="handlePrev"></i>
                <span>{{formatText(center.text)}}</span>
                <i v-if="center.next" placement="top" v-tooltip :title="center.next" class="gk-icon-angleright" :class="{'gk-disable': selectedIndex === (list.length - 1)}" @click="handleNext"></i>
            </div>
            <div class="gk-slide-toolbar-right">
                <i :class="btn.icon" placement="top" v-tooltip :title="btn.title" v-for="(btn, idx) in right" :key="idx" @click="handleBtn(btn)"></i>
            </div>
        </div>
    </section>
</template>

<script>
  import tooltip from 'gokuai-components/packages/tooltip/src/tooltip';

  export default {
    name: "gkSlide",
    directives: {tooltip},
    props: {
      shortcut: {
        type: Boolean,
        default: true
      },
      fit: Boolean,
      toolbar: Boolean,
      list: Array,
      options: {
        type: Object,
        default() {
          return {};
        }
      },
      value: Object | String,
      id: String
    },
    computed: {
      left() {
        return this.toolbar && this.options.left || [];
      },
      center() {
        if (!this.options) {
          return {
            prev: false,
            text: '',
            right: false
          };
        }
        return Object.assign({
          prev: 'prev',
          text: '[index] of [count]',
          next: 'next'
        }, this.options.center);
      },
      right() {
        return this.toolbar && this.options.right || [];
      }
    },
    data() {
      return {
        selected: this.value || this.list[0],
        selectedIndex: this.getIndex()
      }
    },
    methods: {
      formatText(text) {
        return text.replace('[index]', this.selectedIndex + 1).replace('[count]', this.list.length);
      },
      handleBtn(btn) {
        if (typeof btn.handle === 'function') {
          btn.handle(this.selected);
        }
      },
      getIndex() {
        if (!this.toolbar) {
          return 0;
        }
        let nodeValue = typeof this.value === 'string' ? this.value : this.id === undefined ? JSON.stringify(this.value) : this.value[this.id];
        for (let i = 0; i < this.list.length; i++) {
          let value = this.list[i];
          if (typeof value === 'string') {
            if (value === nodeValue) {
              return i;
            }
          } else {
            if (this.id !== undefined) {
              if (value[this.id] === nodeValue) {
                return i;
              }
            } else {
              if (JSON.stringify(value) === nodeValue) {
                return i;
              }
            }
          }
        }
        return 0;
      },
      handlePrev() {
        if (this.selectedIndex === 0) {
          return;
        }
        this.selected = this.list[--this.selectedIndex];
        this.$emit('input', this.selected);
      },
      handleNext() {
        if (this.selectedIndex === (this.list.length - 1)) {
          return;
        }
        this.selected = this.list[++this.selectedIndex];
        this.$emit('input', this.selected);
      },
      handleDocumentKeydown(event) {
        if (event.code === 'ArrowLeft') {
          this.handlePrev();
          event.preventDefault();
        } else if (event.code === 'ArrowRight') {
          this.handleNext();
          event.preventDefault();
        }
      }
    },
    mounted() {
      if (this.shortcut && this.list && this.list.length) {
        document.addEventListener('keydown', this.handleDocumentKeydown)
      }
    },
    destroyed() {
      document.removeEventListener('keydown', this.handleDocumentKeydown)
    }
  }
</script>