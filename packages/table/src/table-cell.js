import GkCheckbox from "../../checkbox/src/checkbox";

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
      content = this.column.render(this.data);
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
      let label = this.data[column.property];
      content = this.column.formatter ? this.column.formatter(label, this.data) : label ;
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