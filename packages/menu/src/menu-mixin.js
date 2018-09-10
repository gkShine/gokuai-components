import GkMenuItem from "gokuai-components/packages/menu/src/menu-item";

export default {
  components: {GkMenuItem},
  props: {
    data: Array
  },
  data() {
    return {
      menu: null,
      visible: false,
      timer: 0
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
    document.addEventListener('click', this.bodyClick);
  },
  destroyed() {
    document.removeEventListener('click', this.bodyClick);
  }
}