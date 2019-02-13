import GkCheckbox from "gokuai-components/packages/checkbox/src/checkbox";

export default {
  name: "GkThumbnailItem",
  components: { GkCheckbox },
  props: {
    render: Function,
    data: [Object, String],
    property: String,
    size: [Object, Number],
    checkbox: Boolean,
    itemClass: [String, Object],
    isChecked: Boolean
  },
  render (h) {
    let content;
    if (this.render) {
      content = this.render({
        row: this.data,
        index: this.index,
        size: this.size
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
    const computedClass = typeof this.itemClass === 'string' ? { [this.itemClass]: true } : this.itemClass || {};
    return h('li', {
      class: {
        'gk-thumbnail-item': true,
        ['gk-thumbnail-item--' + this.size]: typeof this.size === 'number',
        ...computedClass
      },
      style: this.size instanceof Object && {
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