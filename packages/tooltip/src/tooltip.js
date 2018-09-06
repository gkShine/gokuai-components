export default {
  name: 'gk-tooltip',
  get(el) {
    return document.getElementById(el.getAttribute('aria-describedby'));
  },

  set(el, placement) {
    let tooltip = document.createElement('div');
    tooltip.className = 'gk-tooltip';
    tooltip.id = 'gk-tooltip-' + this.index;
    tooltip.style.zIndex = this.index + '';
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
    let tooltipStyle = window.getComputedStyle(tooltip);
    let left, top;
    switch (placement) {
      case 'top':
        left = position.left + window.pageXOffset - (tooltip.clientWidth - position.width) / 2 - parseInt(tooltipStyle.marginLeft);
        top = position.top + window.pageYOffset - tooltip.clientHeight - parseInt(tooltipStyle.marginTop) - parseInt(tooltipStyle.marginBottom);
        break;
      case 'left':
        left = position.left + window.pageXOffset - tooltip.clientWidth - parseInt(tooltipStyle.marginLeft) - parseInt(tooltipStyle.marginRight);
        top = position.top + window.pageYOffset - (tooltip.clientHeight - position.height) / 2 - parseInt(tooltipStyle.marginTop);
        break;
      case 'right':
        left = position.left + window.pageXOffset + position.width;
        top = position.top + window.pageYOffset - (tooltip.clientHeight - position.height) / 2 - parseInt(tooltipStyle.marginTop);
        break;
      default:
        left = position.left + window.pageXOffset - (tooltip.clientWidth - position.width) / 2 - parseInt(tooltipStyle.marginLeft);
        top = position.top + window.pageYOffset + position.height;
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
    if (!tooltip) {
      return;
    }
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