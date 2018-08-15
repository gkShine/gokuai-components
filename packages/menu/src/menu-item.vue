<template>
    <li class="gk-menu-item" :class="{'gk-menu-item-disabled':disabled}" @click="handleClick" :aria-disabled="disabled">
        <i v-if="icon" :class="icon"></i><slot></slot>
        <span class="gk-menu-item-right" v-if="showRight"><slot name="after"></slot><em v-if="shortcut">{{shortcut}}</em><i v-if="hasSub" class="fa fa-caret-right"></i></span>
    </li>
</template>

<script>
  import { getOS } from "gokuai-components/src/common/util";

  export default {
    name: "GkMenuItem",
    props: {
      divided: Boolean,
      disabled: Boolean,
      command: String|Object|Array|Number,
      icon: String,
      keymap: String
    },
    data() {
      return {
        hasSub: false,
        shortcut: ''
      }
    },
    computed: {
      menu() {
        return this.$parent;
      },
      special() {
        return {
          'SPACE': 'Space',
          'CAPSLOCK': 'CapsLock',
          'TAB': 'Tab',
          'BACKSPACE' : 'Backspace',
          'DELETE': 'Delete',
          'ARROWUP': 'ArrowUp',
          'ARROWDOWN': 'ArrowDown',
          'ARROWLEFT': 'ArrowLeft',
          'ARROWRIGHT': 'ArrowRight'
        }
      },
      showRight() {
        return this.shortcut || this.hasSub || this.$slots.after;
      }
    },
    methods: {
      handleClick(event) {
        if (!this.command) {
          return;
        }
        event.stopPropagation();
        if (this.disabled) {
          return;
        }
        this.menu.handleCommand(this.command);
      },
      initShortcut(code, help) {
        if (this.special[code] !== undefined) {
          code = this.special[code];
          if (help !== undefined) {
            this.shortcut = help + code;
          } else {
            this.shortcut = code;
          }
        }
        if (getOS() === 'Mac' && help === 'META') {
          this.shortcut = '⌘' + code;
        }
        if (code.length === 1) {
          code = 'Key' + code;
        }
        if (help === undefined) {
          document.addEventListener('keydown', (event) => {
            if (event.code === code) {
              this.handleClick(event);
              event.preventDefault();
            }
          });
        } else {
          document.addEventListener('keydown', (event) => {
            if (help === 'META' && !event.metaKey)  {
              return;
            } else if (help === 'CTRL' && !event.ctrlKey) {
              return;
            } else if (help === 'ALT' && !event.altKey)  {
              return;
            } else if (help === 'SHIFT' && !event.shiftKey) {
              return;
            }
            if (event.code === code) {
              this.handleClick(event);
              event.preventDefault();
            }
          });
        }
      }
    },
    mounted() {
      let children = this.$children;
      for (let i = 0; i < children.length; i++) {
        if (children[i].$el.className.indexOf('gk-menu') > -1) {
          this.hasSub = true;
        }
      }
      if (this.keymap) {
        let keymap = this.keymap.toUpperCase();
        this.shortcut = keymap;
        switch (getOS()) {
          case 'Mac':
            if (keymap.indexOf('+') > -1) {
              let [help, code] = keymap.split('+');
              if (help === 'FORCECTRL') {
                help = 'CTRL';
              } else if (['CTRL', 'META'].indexOf(help) > -1) {
                help = 'META';
              }
              this.initShortcut(code, help);
            } else {
              this.initShortcut(keymap);
            }
            break;
          case 'Windows':
          case 'Linux':
            if (keymap.indexOf('+') > -1) {
              let [help, code] = keymap.split('+');
              this.initShortcut(code, help);
            } else {
              this.initShortcut(keymap);
            }
            break;
        }
      }
    }
  }
</script>