<template>
  <div class="gk-breadcrumb">
    <gk-button-group ref="ops" class="gk-breadcrumb-ops" v-if="showNav" plain>
      <gk-button icon="gk-icon-angleleft" @click="handlePrevNext(-1)"></gk-button>
      <gk-button icon="gk-icon-angleright" @click="handlePrevNext(+1)"></gk-button>
      <gk-button icon="gk-icon-long-arrow-up" @click="handleUp"></gk-button>
    </gk-button-group>

    <ul ref="list" class="gk-breadcrumb-list" :class="mode === 'full' ? 'gk-breadcrumb-full' : 'gk-breadcrumb-hidden'">
      <li :key="idx" class="gk-breadcrumb-item" v-for="(item, idx) in data">
        <template v-if="idx < data.length - 1">
          <a href="javascript:void(0)" :title="item[label]" @click="handleClick(item, $event)">{{item[label]}}</a>
          <i class="gk-icon-angleright"></i>
        </template>
        <span v-else :title="item[label]" @click="changeMode('input', $event)">{{item[label]}}</span>
      </li>
    </ul>
    <gk-input ref="input" v-if="mode === 'input'" autofocus @click.native.stop.prevent v-model="input"
              class="gk-breadcrumb-input" @keyup.native.enter="handleGoto" size="mini">
      <template slot="prepend" v-if="data[0]">{{data[0][label]}}</template>
    </gk-input>
    <ul v-show="mode === 'normal'" class="gk-breadcrumb-list">
      <template v-for="(item, idx) in list">
        <li :key="idx+100" v-if="menu.length && idx === 1" class="gk-breadcrumb-item">
          <a href="javascript:void(0)" @click="showMenu">...</a>
          <i class="gk-icon-angleright"></i>
        </li>
        <li :key="idx" class="gk-breadcrumb-item">
          <template v-if="idx < list.length - 1">
            <a href="javascript:void(0)" :title="item[label]" @click="handleClick(item, $event)">{{item[label]}}</a>
            <i class="gk-icon-angleright"></i>
          </template>
          <span v-else :title="item[label]" @click="changeMode('input', $event)">{{item[label]}}</span>
        </li>
      </template>
    </ul>
    <gk-menu ref="more" show-arrow>
      <gk-menu-item v-for="(item, idx) in menu" :key="idx" @click.native="handleClick(item, $event)">{{item[label]}}
      </gk-menu-item>
    </gk-menu>
  </div>
</template>

<script>
  import GkInput from "gokuai-components/packages/input/src/input";
  import GkButton from "gokuai-components/packages/button/src/button";
  import GkButtonGroup from "gokuai-components/packages/button/src/button-group";
  import GkMenu from "gokuai-components/packages/menu/src/menu";
  import GkMenuItem from "gokuai-components/packages/menu/src/menu-item";

  export default {
    name: "GkBreadcrumb",
    components: {GkMenuItem, GkMenu, GkButtonGroup, GkButton, GkInput},
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
      allowInput: Boolean,
      showNav: Boolean,
      id: String
    },
    data() {
      return {
        width: 0,
        mode: 'normal',
        list: [],
        menu: [],
        current: '',
        input: '',
        timer: 0
      };
    },
    watch: {
      data: 'change'
    },
    methods: {
      change() {
        if (!this.data.length) {
          return;
        }
        this.input = this.current = this.data[this.data.length - 1][this.value];
        let _data = Array.from(this.data);

        setTimeout(() => {
          if (this.$refs.list === undefined) {
            return;
          }
          let children = this.$refs.list.children;
          let width = children[0].clientWidth + 38;
          this.menu = [];
          for (let i = children.length - 1; i > 0; i--) {
            width += children[i].clientWidth;
            if (width >= this.width && i !== children.length - 1) {
              this.menu = _data.splice(1, i);
              break;
            }
          }
          this.list = _data;
        }, 100);
      },
      handleClick(item, event) {
        if (item[this.value] === this.current) {
          return;
        }
        this.$emit('navigator', item[this.value], item, this.findIndex(item), event);
        this.$emit('click', item[this.value], item, this.findIndex(item), event);
      },
      handleGoto(event) {
        this.changeMode('normal');
        if (this.input === this.current) {
          return;
        }
        this.$emit('navigator', this.input, null, event);
      },
      handlePrevNext(offset) {
        if (offset > 0) {
          this.$emit('next');
        } else {
          this.$emit('prev');
        }
      },
      handleUp(event) {
        let upItem = this.data[this.data.length - 2];
        upItem && this.handleClick(upItem, event);
      },
      findIndex(item) {
        if (this.id) {
          for (let i = 0; i < this.data.length; i++) {
            if (this.data[i][this.id] === item[this.id]) {
              return i;
            }
          }
        } else {
          for (let i = 0; i < this.data.length; i++) {
            if (JSON.stringify(this.data[i]) === JSON.stringify(item)) {
              return i;
            }
          }
        }
        return -1;
      },
      changeMode(mode, event) {
        switch (mode) {
          case 'input':
            if (this.allowInput && Object.keys(this.$listeners).indexOf('navigator') > -1) {
              this.input = this.current;
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
      },
      windowResize() {
        if (this.mode === 'normal') {
          clearTimeout(this.timer);
          this.timer = setTimeout(() => {
            this.change();
          }, 500);
        }
      },
      documentClick() {
        this.mode === 'input' && (this.mode = 'normal');
      },
      toUp() {
        this.handleUp();
      }
    },
    mounted() {
      this.width = this.$el.clientWidth - 26;
      if (this.showNav) {
        this.width = this.width - this.$refs.ops.$el.clientWidth;
      }
      this.change();
      document.addEventListener('click', this.documentClick);
      window.addEventListener('resize', this.windowResize);
    },
    destroyed() {
      document.removeEventListener('click', this.documentClick);
      window.removeEventListener('resize', this.windowResize);
    }
  }
</script>