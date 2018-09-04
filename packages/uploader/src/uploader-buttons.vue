<template>
    <div class="gk-uploader-buttons" :class="{'gk-uploader-buttons-inline':!dropdown}">
        <gk-dropdown v-if="dropdown && list.length > 1">
            <gk-button :size="size">
                <slot></slot>
            </gk-button>
            <gk-dropdown-menu slot="dropdown" class="gk-uploader-dropdown">
                <gk-dropdown-item v-for="(button, index) in list" :key="index" :class="button.class">{{button.label}}
                </gk-dropdown-item>
            </gk-dropdown-menu>
        </gk-dropdown>
        <template v-else>
            <gk-button :size="size" :type="getButtonType(button.type)" v-for="(button, index) in list" :key="index"
                       :class="button.class">
                {{button.label}}
            </gk-button>
        </template>
    </div>
</template>

<script>
  import GkButton from "gokuai-components/packages/button/src/button";
  import GkDropdown from "gokuai-components/packages/dropdown/src/dropdown";
  import GkDropdownMenu from "gokuai-components/packages/dropdown/src/dropdown-menu";
  import GkDropdownItem from "gokuai-components/packages/dropdown/src/dropdown-item";
  import {isIE} from "gokuai-components/src/common/util";

  export default {
    name: "GkUploaderButtons",
    components: {GkButton, GkDropdown, GkDropdownMenu, GkDropdownItem},
    props: {
      size: String,
      buttons: Array,
      dropdown: Boolean,
      translate: Object
    },
    data() {
      return {};
    },
    computed: {
      isIE() {
        return isIE();
      },
      list() {
        let list = [];
        if (this.buttons === undefined) {
          list = Object.values(this.defaultButtons);
        } else {
          this.buttons.forEach((button) => {
            if (button.type === 'folder' && this.isIE) {
              return;
            }
            list.push(Object.assign(this.defaultButtons[button.type], button));
          });
        }
        return list;
      },
      defaultButtons() {
        return {
          delete: {
            type: 'delete',
            class: 'gk-uploader-delete',
            label: this.gettext('delete')
          },
          file: {
            type: 'file',
            class: 'gk-uploader-file',
            label: this.gettext('upload file')
          },
          folder: {
            type: 'folder',
            class: 'gk-uploader-folder',
            label: this.gettext('upload folder')
          }
        };
      }
    },
    methods: {
      gettext(value) {
        return this.translate && this.translate[value] || value;
      },
      getButtonType(type) {
        return ['file', 'folder'].indexOf(type) > -1 ? 'html' : 'button'
      }
    }
  }
</script>
