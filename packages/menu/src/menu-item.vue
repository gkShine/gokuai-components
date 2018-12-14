<template>
  <li class="gk-menu-item" :class="{'is-disabled':disabled}" @click="handleClick" :aria-disabled="disabled">
    <gk-icon v-if="icon" :icon="icon" /><span class="gk-menu-item-right" v-if="showRight"><slot name="after"></slot><em v-if="shortcut">{{shortcut}}</em><gk-icon v-if="hasSub" icon="caretright" /></span><slot></slot>
  </li>
</template>

<script>
  import {getOS} from "gokuai-components/src/common/util";
  import GkIcon from "gokuai-components/packages/icon/src/icon";

  export default {
    name: "GkMenuItem",
    components: {GkIcon},
    props: {
      divided: Boolean,
      disabled: Boolean,
      command: String | Object | Array | Number,
      icon: String,
      keymap: String
    },
    data() {
      return {
        hasSub: false,
        helpKey: undefined,
        keyCode: undefined,
        shortcut: ''
      }
    },
    computed: {
      menu() {
        return this.$parent;
      },
      special() {
        return {
          65: 'A',
          66: 'B',
          67: 'C',
          68: 'D',
          69: 'E',
          70: 'F',
          71: 'G',
          72: 'H',
          73: 'I',
          74: 'J',
          75: 'K',
          76: 'L',
          77: 'M',
          78: 'N',
          79: 'O',
          80: 'P',
          81: 'Q',
          82: 'R',
          83: 'S',
          84: 'T',
          85: 'U',
          86: 'V',
          87: 'W',
          88: 'X',
          89: 'Y',
          90: 'Z',
          48: '0',
          49: '1',
          50: '2',
          51: '3',
          52: '4',
          53: '5',
          54: '6',
          55: '7',
          56: '8',
          57: '9',
          112: 'F1',
          113: 'F2',
          114: 'F3',
          115: 'F4',
          116: 'F5',
          117: 'F6',
          118: 'F7',
          119: 'F8',
          120: 'F9',
          121: 'F10',
          122: 'F11',
          123: 'F12',
          8: 'BackSpace',
          9: 'Tab',
          12: 'Clear',
          13: 'Enter',
          16: 'Shift',
          17: 'Control',
          18: 'Alt',
          20: 'Cape Lock',
          27: 'Esc',
          32: 'Space',
          33: 'Page Up',
          34: 'Page Down',
          35: 'End',
          36: 'Home',
          37: 'Left',
          38: 'Up',
          39: 'Right',
          40: 'Down',
          45: 'Insert',
          46: 'Delete',
          144: 'Num Lock',
          186: ';',
          187: '=',
          188: ',',
          189: '-',
          190: '.',
          191: '/',
          192: '`',
          219: '[',
          220: '\\',
          221: ']',
          222: '\''
        }
      },
      showRight() {
        return this.shortcut || this.hasSub || this.$slots.after;
      }
    },
    methods: {
      handleClick(event) {
        if (this.command === undefined) {
          return;
        }
        event.stopPropagation();
        if (this.disabled) {
          return;
        }
        this.menu.handleCommand(this.command);
      },
      initShortcut(code, help) {
        code = parseInt(code);
        const codeName = this.special[code];
        if (codeName === undefined) {
          return;
        }
        if (help !== undefined) {
          if (getOS() === 'Mac' && help === 'META') {
            this.shortcut = '⌘' + codeName;
          } else {
            this.shortcut = (help.slice(0, 1) + help.slice(1).toLowerCase()) + '+' + codeName;
          }
        } else {
          this.shortcut = codeName;
        }
        this.keyCode = code;
        this.helpKey = help;
        if (help === undefined) {
          document.addEventListener('keydown', this.documentKeyDown);
        } else {
          document.addEventListener('keydown', this.documentKeyDownWithHelp);
        }
      },
      documentKeyDown(event) {
        if (event.keyCode === this.keyCode) {
          this.handleClick(event);
          event.preventDefault();
        }
      },
      documentKeyDownWithHelp(event) {
        if (this.helpKey === 'META' && !event.metaKey) {
          return;
        } else if (this.helpKey === 'CTRL' && !event.ctrlKey) {
          return;
        } else if (this.helpKey === 'ALT' && !event.altKey) {
          return;
        } else if (this.helpKey === 'SHIFT' && !event.shiftKey) {
          return;
        }
        if (event.keyCode === this.keyCode) {
          this.handleClick(event);
          event.preventDefault();
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
    },
    destroyed() {
      if (this.helpKey === undefined) {
        document.removeEventListener('keydown', this.documentKeyDown);
      } else {
        document.removeEventListener('keydown', this.documentKeyDownWithHelp);
      }
    }
  }
</script>