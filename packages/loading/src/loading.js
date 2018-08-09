export default {
  show(el) {
    if (!this.exist) {
      let position = window.getComputedStyle(el).position;
      if (position === 'static' || position === '') {
        this.static = true;
        el.style.position = 'relative';
      }

      let box = document.createElement('div');
      box.className = 'gk-loading-wrapper';
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
    window.requestAnimationFrame(() => {
      this.box.style.opacity = '1';
    });
  },

  hide(el) {
    this.box.addEventListener('transitionend', () => {
      this.box.remove();
      this.exist = false;

      if (this.static) {
        el.style.removeProperty('position');
      }
    });

    this.box.style.opacity = '0.01';
  },

  bind(el, binding) {
    let self = binding.def;
    self.static = false;
    self.box = null;
    self.exist = false;
    self.options = {
      bg: el.getAttribute('gk-loading-background') || false,
      text: el.getAttribute('gk-loading-text') || false
    };
  },

  update(el, binding) {
    let self = binding.def;
    if (binding.value) {
      self.show(el);
      self.exist = true;
    } else {
      if (!self.exist) {
        return;
      }
      self.hide(el);
    }
  }
};