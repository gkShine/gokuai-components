export default {
  name: "GkThumbnailItem",
  props: {
    render: Function,
    data: Object|String,
    property: String,
    size: {
      type: Object,
      default: () => {
        return {w: 148, h: 180};
      }
    }
  },
  render(h) {
    let content;
    if (this.render) {
      content = this.render(this.data);
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
      content
    ]);
  }
}