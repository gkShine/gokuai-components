export default {
  name: "GkDropdownMenu",
  props: {
    'show-arrow': Boolean
  },
  render(h) {
    let list = [];
    this.$slots.default.forEach((vnode) => {
      if (vnode.componentOptions.propsData.divided !== undefined) {
        list.push(h('li', {
          'class': 'gk-dropdown-divided'
        }));
      }
      list.push(vnode);
    });
    if (this.showArrow) {
      list.push(h('div', {
        'class': 'gk-dropdown-arrow'
      }));
    }
    return h('ul', {
      'class': 'gk-dropdown-menu'
    }, list);
  }
}