import GkMenuItem from "gokuai-components/packages/menu/src/menu-item";

export default {
  name: "GkSubmenu",
  components: {GkMenuItem},
  props: {
    trigger: {
      type: String,
      default: 'hover'
    },
    data: Array
  },
  data() {
    return {
      menu: null,
      visible: false,
      timer: 0
    }
  },
  render(h) {
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
      this.$slots.default.forEach((vnode) => {
        if (vnode.componentOptions.propsData.divided !== undefined) {
          list.push(h('li', {
            'class': 'gk-menu-divided'
          }));
        }
        list.push(vnode);
      });
    }
    return h('ul', {
      'class': 'gk-menu gk-sub-menu'
    }, list);
  },
  computed: {
    parentMenu() {
      return this.$parent.$parent;
    }
  },
  methods: {
    handleCommand(command) {
      this.parentMenu.handleCommand(command);
      this.hideMenu();
    },
    showMenu() {
      this.visible = true;
      this.menu.style.display = 'block';
      this.setPosition();
      window.requestAnimationFrame(() => {
        this.menu.style.opacity = '1';
      });
    },
    hideMenu() {
      this.visible = false;
      this.menu.style.opacity = '0.01';
    },
    setPosition() {
      let menuStyle = window.getComputedStyle(this.menu);

      let left = this.dom.clientWidth;
      let top = this.dom.offsetTop - parseInt(menuStyle.paddingTop);

      this.menu.style.left = left + 'px';
      this.menu.style.top = top + 'px';

      let menuPos = this.menu.getBoundingClientRect();
      if (menuPos.left + this.menu.clientWidth > window.innerWidth) {
        left = -this.menu.clientWidth;
        this.menu.style.left = left + 'px';
      }

      let overtop = menuPos.top + this.menu.clientHeight + parseInt(menuStyle.marginBottom) - window.innerHeight;
      if (overtop > 0) {
        top -= overtop;
        this.menu.style.top = top + 'px';
      }
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
    }
  },
  mounted() {
    this.dom = this.$parent.$el;
    this.menu = this.$el;
    this.bind();

    this.menu.addEventListener('transitionend', () => {
      if (this.visible === false) {
        this.menu.style.display = 'none';
      }
    });

    document.body.addEventListener('click', () => {
      this.visible && this.hideMenu();
    });
  }
}