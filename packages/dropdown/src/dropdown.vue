<template>
    <div class="gk-dropdown">
        <slot></slot>
        <slot name="dropdown"></slot>
    </div>
</template>

<script>
  export default {
    name: "GkDropdown",
    props: {
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
        menu: null,
        show: false,
        timer: 0
      }
    },
    methods: {
      showMenu() {
        this.show = true;
        if (this.menu.parentNode.nodeName !== 'BODY') {
          document.body.appendChild(this.menu);
        }
        this.setPosition();
        window.requestAnimationFrame(() => {
          this.menu.style.opacity = '1';
        });
        this.$emit('visible-change', true);
      },
      hideMenu() {
        this.show = false;
        this.menu.style.opacity = '0.01';
        this.$emit('visible-change', false);
      },
      setPosition() {
        let {left, top} = this.getPosition(this.placement);
        this.menu.style.left = left + 'px';
        this.menu.style.top = top + 'px';
      },
      getPosition(placement) {
        let left, top;
        let position = this.dom.getBoundingClientRect();
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
        if (top + this.menu.clientHeight - parseInt(menuStyle.marginTop) > window.clientHeight) {
          top = topTop;
        }
        if (left < 0) {
          left = centerLeft;
          if (left < 0) {
            left = endLeft;
          }
        }
        if (left + this.menu.clientWidth > window.clientWidth) {
          left = centerLeft;
          if (left + this.menu.clientWidth > window.clientWidth) {
            left = startLeft;
          }
        }
        return {left, top}
      }
    },
    mounted() {
      this.menu = this.$children[1].$el;

      this.dom = this.$children[0].$el;
      switch (this.trigger) {
        case 'click':
          this.dom.onclick = (event) => {
            if (this.show) {
              this.hideMenu();
            } else {
              this.showMenu();
            }
            event.stopPropagation();
          };
          break;
        case 'hover':
          this.$el.onmouseenter = () => {
            clearTimeout(this.timer);
            this.showMenu();
          };
          this.$el.onmouseleave = () => {
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

      document.body.addEventListener('click', () => {
        this.hideMenu();
      });
    }
  }
</script>