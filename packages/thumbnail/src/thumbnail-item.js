import GkCheckbox from "gokuai-components/packages/checkbox/src/checkbox";

export default {
  name: "GkThumbnailItem",
  components: {GkCheckbox},
  props: {
    render: Function,
    data: Object|String,
    property: String,
    size: Object,
    checkbox: Boolean,
    'is-checked': Boolean
  },
  render(h) {
    let content;
    if (this.render) {
      content = this.render({
        row: this.data,
        index: this.index
      });
    } else {
      let src = '';
      if (typeof this.data === 'object') {
        src = this.data[this.property];
      } else {
        src = this.data;
      }
      content = h('img', {
        attrs: {
          src: src
        }
      });
    }
    return h('li', {
      class: {
        'gk-thumbnail-item': true
      },
      style: {
        width: this.size.w + 'px',
        height: this.size.h + 'px'
      }
    }, [
      content,
      this.checkbox && h('gk-checkbox', {
        class: 'gk-thumbnail-checkbox',
        props: {
          isChecked: this.isChecked
        },
        nativeOn: {
          click: (event) => {
            this.$emit('change-checked', event);
          }
        }
      })
    ]);
  }
}