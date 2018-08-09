export default {
  get(el) {
    return document.getElementById(el.getAttribute('aria-describedby'));
  },

  set(el, placement) {
    let tooltip = document.createElement('div');
    tooltip.className = 'gk-tooltip';
    tooltip.id = 'gk-tooltip-' + this.index;
    tooltip.textContent = el.getAttribute('title') || el.getAttribute('content');
    el.setAttribute('content', tooltip.textContent);
    document.body.appendChild(tooltip);

    let arrow = document.createElement('s');
    arrow.className = 'gk-tooltip-arrow gk-arrow-' + placement;
    tooltip.appendChild(arrow);

    this.position(el, tooltip, placement);
    return tooltip;
  },

  position(el, tooltip, placement) {
    let position = el.getBoundingClientRect();
    let left, top, offset=10;
    switch (placement) {
      case 'top':
        left = position.left - tooltip.clientWidth / 2 + position.width / 2;
        top = position.top + position.height + offset / 2 + 4;
        break;
      case 'left':
        left = position.left - tooltip.clientWidth - offset - 4;
        top = position.top - (tooltip.clientHeight - position.height) / 2;
        break;
      case 'right':
        left = position.left + position.width + offset + 4;
        top = position.top - (tooltip.clientHeight - position.height) / 2;
        break;
      default:
        left = position.left - tooltip.clientWidth / 2 + position.width / 2;
        top = position.top - position.height - offset - 4;
    }
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
  },

  show(el) {
    let tooltip = this.get(el);
    let placement = el.getAttribute('placement') || 'bottom';
    if (!tooltip) {
      tooltip = this.set(el, placement);
      el.setAttribute('aria-describedby', tooltip.id);
      el.removeAttribute('title');
      this.index += 2;
    } else {
      this.position(el, tooltip, placement);
    }
    window.requestAnimationFrame(() => {
      tooltip.style.opacity = '0.9';
    });
  },

  hide(el) {
    let tooltip = this.get(el);
    tooltip.addEventListener('transitionend', () => {
      tooltip.remove();
    });
    tooltip.style.opacity = '0.01';
  },

  bind(el, binding) {
    let self = binding.def;
    self.index = 2000;
    el.onmouseenter = ({target}) => {
      self.show(target);
    };
    el.onmouseout = ({target}) => {
      self.hide(target);
    };
  },

  update(el, binding) {
  }
};