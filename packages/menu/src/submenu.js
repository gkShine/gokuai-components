import GkMenuMixin from "gokuai-components/packages/menu/src/menu-mixin";
import { device } from 'device.js';

export default {
  name: "GkSubmenu",
  mixins: [GkMenuMixin],
  props: {
    trigger: {
      type: String,
      default: device.mobile ? 'click' : 'hover'
    }
  },
  data() {
    return {
    }
  },
  render(h) {
    let list = this.renderList(h);
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
      if (!("AnimationEvent" in window)) {
          this.menu.style.display = 'none';
      }
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
    }
  },
  mounted() {
    this.menu = this.$el;
    this.dom = this.$parent.$el;
    this.bind();
  }
}