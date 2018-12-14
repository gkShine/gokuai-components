import GkMenuMixin from "gokuai-components/packages/menu/src/menu-mixin";
import GkSubmenu from "gokuai-components/packages/menu/src/submenu";
import touch from "gokuai-components/packages/touch/src/touch";

export default {
  name: "GkMenu",
  mixins: [GkMenuMixin],
  components: {GkSubmenu},
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
    }
  },
  data() {
    return {
      dom: null,
      wrapper: null,
      position: null,
      timer2: 0
    }
  },
  render(h) {
    let list = this.renderList(h);
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
      if (parent && parent.$el.className.indexOf('gk-dropdown') > -1) {
        return parent;
      }
      return null;
    }
  },
  watch: {
    visible: 'updateDropdown'
  },
  methods: {
    updateDropdown(value) {
      this.dropdown && (this.dropdown.opened = value);
    },
    handleCommand(command) {
      this.$emit('command', command);
      this.dropdown && this.dropdown.$emit('command', command);
      this.hideMenu();
    },
    show(event) {
      if (event instanceof MouseEvent) {
        this.position = {
          left: event.clientX,
          top: event.clientY,
          height: 0,
          width: 0
        };
      } else {
        this.dom = event;
      }
      this.showMenu();
    },
    showMenu() {
      this.visible = true;
      if (this.menu.parentNode.nodeName !== 'BODY') {
        document.body.appendChild(this.menu);
      }
      this.menu.style.display = 'block';
      if (this.isMobile) {
        this.afterWrapper();
      } else {
        this.setPosition();
      }
      window.requestAnimationFrame(() => {
        if (this.isMobile) {
          this.menu.style.bottom = '0';
        } else {
          this.menu.style.opacity = '1';
        }
      });
      this.$emit('visible-change', true);
    },
    hide() {
      this.hideMenu();
    },
    hideMenu() {
      this.visible = false;
      if (this.isMobile) {
        this.wrapper.style.display = 'none';
        this.menu.style.bottom = '-100%';
      } else {
        this.menu.style.opacity = '0.01';
      }
      if (!("AnimationEvent" in window)) {
        this.menu.style.display = 'none';
      }
      this.$emit('visible-change', false);
    },
    setPosition() {
      if (this.dom && this.trigger !== 'contextmenu') {
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
        topTop: position.top + window.pageYOffset - this.menu.clientHeight - parseInt(menuStyle.marginTop) - parseInt(menuStyle.marginBottom),
        bottomTop: position.top + window.pageYOffset + position.height,
        startLeft: position.left + window.pageXOffset,
        centerLeft: position.left + window.pageXOffset - (this.menu.clientWidth - position.width) / 2,
        endLeft: position.left + window.pageXOffset - this.menu.clientWidth + position.width
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
      if (position.top + position.height + this.menu.clientHeight - parseInt(menuStyle.marginTop) > window.innerHeight) {
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
      return {left , top}
    },
    afterWrapper() {
      if (this.wrapper === null) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('gk-menu-wrapper');
        document.body.appendChild(wrapper);
        touch.bindEl(wrapper, 'tap', (e) => {
          this.bodyClick();
          e.preventDefault();
        });
        this.wrapper = wrapper;
      } else {
        this.wrapper.style.display = 'block';
      }
    },
    windowResize() {
      if (!this.isMobile && this.visible) {
        clearTimeout(this.timer2);
        this.timer2 = setTimeout(() => {
          this.setPosition();
        }, 100);
      }
    }
  },
  mounted() {
    this.menu = this.$el;
    if (this.isMobile) {
      this.menu.classList.add('gk-mobile-menu');
    }
    if (this.target) {
      this.dom = this.$parent.$refs[this.target].$el;
    } else if (this.$parent.btn) {
      this.dom = this.$parent.btn;
    }
    if (this.dom) {
      this.bind();
      window.addEventListener('resize', this.windowResize);
    }
  },
  destroyed() {
    window.removeEventListener('resize', this.windowResize);
    if (this.isMobile && this.wrapper !== null) {
      this.wrapper.remove();
    }
  }
}