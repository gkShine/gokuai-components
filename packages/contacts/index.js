import Contacts from './src/contacts';

Contacts.install = function(Vue) {
  Vue.component(Contacts.name, Contacts);
};

export default Contacts;
