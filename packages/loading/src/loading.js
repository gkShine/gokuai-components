import "mdn-polyfills/Node.prototype.remove";

export default {
  name: 'gk-loading',
  show(el) {
    if (!this.exist) {
      let position = window.getComputedStyle(el).position;
      if (position === 'static' || position === '') {
        this.static = true;
        el.style.position = 'relative';
      }
      el.classList.add('gk-loading-scope');

      let box = document.createElement('div');
      box.className = 'gk-loading-wrapper';
      box.style.top = el.scrollTop + 'px';
      box.style.left = el.scrollLeft + 'px';
      box.style.bottom = -el.scrollTop + 'px';
      box.style.right = -el.scrollLeft + 'px';
      if (this.options.bg !== false) {
        box.style.backgroundColor = this.options.bg;
      }
      el.appendChild(box);

      let loading = document.createElement('div');
      loading.className = 'gk-loading';
      loading.innerHTML =
        '<svg style="styles" class="gk-loading-spinner" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">'
        + '<circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>'
        + '</svg>';
      box.appendChild(loading);

      if (this.options.text !== false) {
        loading.classList.add('gk-loading-text');

        let text = document.createElement('p');
        text.textContent = this.options.text;
        loading.appendChild(text);
      }
      this.box = box;
    }
    this.exist = true;
    window.requestAnimationFrame(() => {
        this.box.style.opacity = '1';
    });
  },

  hide(el) {
    el.classList.remove('gk-loading-scope');

    this.box.style.opacity = '0.01';
    this.box.addEvent('transitionend', () => {
      this.box.remove();
      this.box = null;
      this.exist = false;

      if (this.static) {
        el.style.removeProperty('position');
      }
    });
  },

  bind(el, binding) {
    let self = binding.def;
    self.box = null;
    self.static = self.exist = false;
    self.options = {
      bg: el.getAttribute('gk-loading-background') || false,
      text: el.getAttribute('gk-loading-text') || false
    };
  },

  update(el, binding) {
    let self = binding.def;
    if (binding.oldValue === binding.value) {
      return;
    }
    if (binding.value) {
      self.show(el);
    } else {
      if (!self.exist) {
        return;
      }
      self.hide(el);
    }
  }
};
