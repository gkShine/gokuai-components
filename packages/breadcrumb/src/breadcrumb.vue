<template>
    <div class="gk-breadcrumb">
        <gk-button-group ref="ops" class="gk-breadcrumb-ops" v-if="showNav" plain>
            <gk-button icon="gk-icon-angleleft" @click="handlePrevNext(-1)"></gk-button>
            <gk-button icon="gk-icon-angleright" @click="handlePrevNext(+1)"></gk-button>
        </gk-button-group>

        <ul ref="list" class="gk-breadcrumb-list" :class="mode === 'full' ? 'gk-breadcrumb-full' : 'gk-breadcrumb-hidden'">
            <li :key="idx" class="gk-breadcrumb-item" v-for="(item, idx) in navs">
                <template v-if="idx < data.length - 1">
                    <a href="javascript:void(0)" :title="item[label]" @click="handelClick(item, $event)">{{item[label]}}</a>
                    <i class="gk-icon-angleright"></i>
                </template>
                <span v-else :title="item[label]" @click="changeMode('input', $event)">{{item[label]}}</span>
            </li>
        </ul>
        <input ref="input" v-show="mode === 'input'" @click.stop.prevent v-model="input" class="gk-breadcrumb-input" @keyup.enter="handleGoto" />
        <ul v-show="mode === 'normal'" class="gk-breadcrumb-list">
            <template v-for="(item, idx) in list">
                <li :key="idx+100" v-if="menu.length && idx === 1" class="gk-breadcrumb-item" >
                    <a href="javascript:void(0)" @click="showMenu">...</a>
                    <i class="gk-icon-angleright"></i>
                </li>
                <li :key="idx" class="gk-breadcrumb-item" >
                    <template v-if="idx < list.length - 1">
                        <a href="javascript:void(0)" :title="item[label]" @click="handelClick(item, $event)">{{item[label]}}</a>
                        <i class="gk-icon-angleright"></i>
                    </template>
                    <span v-else :title="item[label]" @click="changeMode('input', $event)">{{item[label]}}</span>
                </li>
            </template>
        </ul>
        <gk-menu ref="more" show-arrow>
            <gk-menu-item v-for="(item, idx) in menu" :key="idx" @click.native="handelClick(item, $event)">{{item[label]}}</gk-menu-item>
        </gk-menu>
    </div>
</template>

<script>
  import GkButton from "gokuai-components/packages/button/src/button";
  import GkButtonGroup from "gokuai-components/packages/button/src/button-group";
  import GkMenu from "gokuai-components/packages/menu/src/menu";
  import GkMenuItem from "gokuai-components/packages/menu/src/menu-item";

  export default {
    name: "GkBreadcrumb",
    components: {GkMenuItem, GkMenu, GkButtonGroup, GkButton},
    props: {
      data: {
        type: Array,
        required: true
      },
      label: {
        type: String,
        default: 'label'
      },
      value: {
        type: String,
        default: 'value'
      },
      'show-nav': Boolean,
      'index': {
        type: String,
        default: '$_i'
      }
    },
    data() {
      return {
        width: 0,
        mode: 'normal',
        list: [],
        menu: [],
        history: [],
        current: '',
        input: ''
      };
    },
    watch: {
      navs: 'change'
    },
    computed: {
      navs() {
        let navs = [];
        this.data.forEach((nav, index) => {
          nav[this.index] = index;
          navs.push(nav);
        });
        return navs;
      }
    },
    methods: {
      change(data) {
        if (!data.length) {
          return;
        }
        this.input = this.current = data[data.length - 1][this.value];
        let _data = Array.from(data);

        setTimeout(() => {
          let children = this.$refs.list.children;
          let width = children[0].clientWidth;
          this.menu = [];
          for (let i = children.length - 1; i > 0; i--) {
            width += children[i].clientWidth;
            if (width > this.width && i !== children.length - 1) {
              this.menu = _data.splice(1, i);
              break;
            }
          }
          this.list = _data;
        },100);
      },
      handelClick(item, event) {
        if (item[this.input] === this.current) {
          return;
        }
        this.history.push(this.current);
        let index = item[this.index];
        this.$emit('navigator', item[this.value], this.data[index], index, event);
      },
      handleGoto() {
        this.changeMode('normal');
        if (this.input === this.current) {
          return;
        }
        this.history.push(this.value);
        this.$emit('goto', this.value);
      },
      handlePrevNext(offset) {
        if (offset > 0) {
          this.$emit('next');
        } else {
          this.$emit('prev');
        }
      },
      changeMode(mode, event) {
        switch (mode) {
          case 'input':
            if (Object.keys(this.$listeners).indexOf('goto') > -1) {
              this.mode = mode;
            }
            break;
          default:
            this.mode = mode;
        }
        event && event.stopPropagation();
      },
      showMenu(event) {
        this.$refs.more.show(event.target);
        event.stopPropagation();
      }
    },
    mounted() {
      this.width = this.$el.clientWidth - 26;
      if (this.showNav) {
        this.width = this.width - this.$refs.ops.$el.clientWidth;
      }
      this.change(this.navs);
      document.addEventListener('click', () => {
        this.mode === 'input' && (this.mode = 'normal');
      });
      let timer = 0;
      window.addEventListener('resize', () => {
        if (this.mode === 'normal') {
          clearTimeout(timer);
          timer = setTimeout(() => {
            this.change(this.navs);
          }, 100);
        }
      });
    }
  }
</script>