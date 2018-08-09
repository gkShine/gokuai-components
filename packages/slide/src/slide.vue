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
                <i :class="btn.icon" v-tooltip :title="btn.title" v-for="(btn, idx) in left" :key="idx" @click="handleBtn(btn)"></i>
            </div>
            <div class="gk-slide-toolbar-center">
                <i v-if="center.prev" v-tooltip :title="center.prev" class="fa fa-angle-left" :class="{'gk-disable': selectedIndex === 0}" @click="handlePrev"></i>
                <span>{{formatText(center.text)}}</span>
                <i v-if="center.next" v-tooltip :title="center.next" class="fa fa-angle-right" :class="{'gk-disable': selectedIndex === (list.length - 1)}" @click="handleNext"></i>
            </div>
            <div class="gk-slide-toolbar-right">
                <i :class="btn.icon" v-tooltip :title="btn.title" v-for="(btn, idx) in right" :key="idx" @click="handleBtn(btn)"></i>
            </div>
        </div>
    </section>
</template>

<script>
  import tooltip from '../../tooltip/src/tooltip';

  export default {
    name: "gkSlide",
    directives: {tooltip},
    props: {
      fit: Boolean,
      toolbar: Boolean,
      list: {
        type: Array,
        required: true
      },
      options: {
        type: Object,
        default() {
          return {};
        }
      },
      value: {
        type: Object
      },
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
        for (let i = 0; i < this.list.length; i++) {
          let value = this.list[i];
          if (typeof value === 'string') {
            if (value === this.value) {
              return i;
            }
          } else {
            if (value[this.id] === this.value[this.id]) {
              return i;
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
      },
      handleNext() {
        if (this.selectedIndex === (this.list.length - 1)) {
          return;
        }
        this.selected = this.list[++this.selectedIndex];
      }
    }
  }
</script>