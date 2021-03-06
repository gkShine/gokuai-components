import GkCheckbox from "gokuai-components/packages/checkbox/src/checkbox";

export default {
  name: "gkTableCell",
  components: {GkCheckbox},
  props: {
    column: Object,
    data: Object,
    index: Number,
    isChecked: Boolean
  },
  render(h) {
    let column = this.column;
    let content;
    if (column.render) {
      content = this.column.render({
        row: this.data,
        index: this.index
      });
    } else if (column.checkbox) {
      content = h('gk-checkbox', {
        props: {
          'is-checked': this.isChecked,
        },
        nativeOn: {
          click: (event) => {
            this.$emit('check', this.data, this.index, event);
            // event.stopPropagation();
          },
          dblclick: (event) => {
            event.stopPropagation();
          }
        }
      });
    } else if (column.property) {
      let value = this.data[column.property];
      content = this.column.formatter ? this.column.formatter(value, this.data, this.index) : value ;
    } else if (this.column.formatter) {
      content = this.column.formatter();
    }
    return h('td', {
      style: column.columnStyle,
      'class': {'gk-table-checkbox': column.checkbox}
    }, [
      content
    ]);
  },
  computed: {
    label() {
      let value = this.data[this.column.property];
      if (this.column.formatter) {
        return this.column.formatter(value, this.data);
      }
      return value;
    }
  }
}