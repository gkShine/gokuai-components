export default {
  name: "GkDropdownMenu",
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
    return h('ul', {
      'class': 'gk-dropdown-menu'
    }, list);
  }
}