import "mdn-polyfills/Node.prototype.remove";
import GkMenuItem from "gokuai-components/packages/menu/src/menu-item";
import touch from "gokuai-components/packages/touch/src/touch";

export default {
  components: {GkMenuItem},
  props: {
    data: Array,
    adaptive: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      menu: null,
      visible: false,
      timer: 0
    }
  },
  computed: {
    isMobile() {
      return this.adaptive && touch.device.mobile;
    }
  },
  methods: {
    renderList(h) {
      let list = [];
      if (this.data !== undefined) {
        this.data.forEach((node) => {
          if (node.divided) {
            list.push(h('li', {
              'class': 'gk-menu-divided'
            }));
          }
          if (typeof node.children === 'object') {
            list.push(h('gk-menu-item', {
              props: node
            }, [node.label, h('gk-submenu', {
              props: {
                data: node.children
              }
            })]));
          } else {
            list.push(h('gk-menu-item', {
              props: node
            }, node.label));
          }
        });
      } else {
        this.$slots.default && this.$slots.default.forEach((vnode) => {
          if (vnode.componentOptions && vnode.componentOptions.propsData.divided !== undefined) {
            list.push(h('li', {
              'class': 'gk-menu-divided'
            }));
          }
          list.push(vnode);
        });
      }
      return list;
    },
    bind() {
      switch (this.trigger) {
        case 'click':
          this.dom.onclick = (event) => {
            if (this.visible) {
              this.hideMenu();
            } else {
              this.showMenu();
            }
            event.stopPropagation();
          };
          break;
        case 'contextmenu':
          this.dom.oncontextmenu = (event) => {
            this.position = {
              left: event.clientX,
              top: event.clientY,
              height: 0,
              width: 0
            };
            this.showMenu();
            event.preventDefault();
          };
          break;
        case 'hover':
          this.dom.onmouseenter = () => {
            clearTimeout(this.timer);
            this.showMenu();
          };
          this.dom.onmouseleave = () => {
            this.timer = setTimeout(() => {
              this.hideMenu();
            }, 100);
          };
          this.menu.onmouseenter = () => {
            clearTimeout(this.timer);
          };
          this.menu.onmouseleave = () => {
            this.timer = setTimeout(() => {
              this.hideMenu();
            }, 100);
          };
          break;
      }
    },
    bodyClick() {
      this.visible && this.hideMenu();
    }
  },
  mounted() {
    this.$el.addEventListener('transitionend', () => {
        if (this.visible === false) {
            this.menu.style.display = 'none';
        }
    });
    //由于firefox的document上的`contextmenu`事件会执行`click`事件，因此改click事件为`mousedown`事件
    !this.isMobile && document.addEventListener('mousedown', this.bodyClick);
  },
  destroyed() {
    this.menu.remove();
    !this.isMobile && document.removeEventListener('mousedown', this.bodyClick);
  }
}