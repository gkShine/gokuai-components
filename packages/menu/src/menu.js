import GkMenuItem from "./menu-item";
import GkSubmenu from "./submenu";

export default {
  name: "GkMenu",
  components: {GkMenuItem, GkSubmenu},
  props: {
    target: String,
    'show-arrow': Boolean,
    trigger: {
      type: String,
      default: 'click'
    },
    placement: {
      type: String,
      default: 'bottom-start'
    },
    data: Array
  },
  data() {
    return {
      dom: null,
      menu: null,
      position: null,
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
    if (this.showArrow) {
      list.push(h('div', {
        'class': 'gk-menu-arrow',
        ref: 'arrow'
      }));
    }
    return h('ul', {
      'class': 'gk-menu'
    }, list);
  },
  computed: {
    dropdown() {
      let parent = this.$parent;
      if (parent && parent.$el.className === 'gk-dropdown') {
        return parent;
      }
      return null;
    }
  },
  methods: {
    handleCommand(command) {
      this.$emit('command', command);
      this.dropdown.$emit('command', command);
      this.hideMenu();
    },
    show(event) {
      this.position = {
        left: event.clientX,
        top: event.clientY,
        height: 0,
        width: 0
      };
      this.showMenu();
    },
    showMenu() {
      this.visible = true;
      if (this.menu.parentNode.nodeName !== 'BODY') {
        document.body.appendChild(this.menu);
      }
      this.menu.style.display = 'block';
      this.setPosition();
      window.requestAnimationFrame(() => {
        this.menu.style.opacity = '1';
      });
      this.$emit('visible-change', true);
    },
    hideMenu() {
      this.visible = false;
      this.menu.style.opacity = '0.01';
      this.$emit('visible-change', false);
    },
    setPosition() {
      if (this.dom) {
        this.position = this.dom.getBoundingClientRect();
      }
      let {left, top} = this.getPosition(this.placement);
      this.menu.style.left = left + 'px';
      this.menu.style.top = top + 'px';

      if (this.$refs.arrow) {
        if (this.position.top > top) {
          //菜单在上面
          this.$refs.arrow.classList.add('gk-menu-arrow-top');
        }
        let arrowStyle = window.getComputedStyle(this.$refs.arrow);
        this.$refs.arrow.style.left = (this.position.left - left + this.position.width / 2 - parseInt(arrowStyle.borderWidth)) + 'px';
      }
    },
    getPosition(placement) {
      let left, top;
      let position = this.position;
      let menuStyle = window.getComputedStyle(this.menu);
      let {topTop, bottomTop, startLeft, centerLeft, endLeft} = {
        topTop: position.top - this.menu.clientHeight - parseInt(menuStyle.marginTop) - parseInt(menuStyle.marginBottom),
        bottomTop: position.top + position.height,
        startLeft: position.left,
        centerLeft: position.left - (this.menu.clientWidth - position.width) / 2,
        endLeft: position.left - this.menu.clientWidth + position.width
      };
      switch (placement) {
        case 'top':
          left = centerLeft;
          top = topTop;
          break;
        case 'top-start':
          left = startLeft;
          top = topTop;
          break;
        case 'top-end':
          left = endLeft;
          top = topTop;
          break;
        case 'bottom':
          left = centerLeft;
          top = bottomTop;
          break;
        case 'bottom-start':
          left = startLeft;
          top = bottomTop;
          break;
        case 'bottom-end':
          left = endLeft;
          top = bottomTop;
          break;
      }
      if (top < 0) {
        top = bottomTop;
      }
      if (top + this.menu.clientHeight - parseInt(menuStyle.marginTop) > window.innerHeight) {
        top = topTop;
      }

      if (left < 0) {
        left = centerLeft;
        if (left < 0) {
          left = startLeft;
        }
      }
      if (left + this.menu.clientWidth > window.innerWidth) {
        left = centerLeft;
        if (left + this.menu.clientWidth > window.innerWidth) {
          left = endLeft;
        }
      }
      return {left, top}
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

      let timer = 0;
      window.addEventListener('resize', () => {
        if (this.visible) {
          clearTimeout(timer);
          timer = setTimeout(() => {
            this.setPosition();
          }, 100);
        }
      });
    }
  },
  mounted() {
    this.menu = this.$el;
    if (this.target) {
      this.dom = this.$parent.$refs[this.target].$el;
    } else if (this.$parent.btn) {
      this.dom = this.$parent.btn;
    }
    if (this.dom) {
      this.bind();
    }

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