/**
 * InteractiveManager - Single Responsibility: Managing interactive elements
 * Open/Closed Principle: New interactive behaviors can be added via extension
 */
class InteractiveManager {
  constructor(containerSelector, options = {}) {
    this.container = document.querySelector(containerSelector);
    this.options = {
      activeClass: 'bg-teal-500',
      dataAttr: 'data-info',
      ...options
    };
    this.elements = new Map();
  }

  registerInteractive(selector, handler) {
    if (!this.container) return;
    
    const elements = this.container.querySelectorAll(selector);
    elements.forEach(element => {
      element.addEventListener('click', handler);
      this.elements.set(element, handler);
    });
  }

  setActive(element, targetSelector) {
    // Remove active from siblings
    const siblings = this.container.querySelectorAll(`[${this.options.dataAttr}]`);
    siblings.forEach(sibling => sibling.classList.remove(this.options.activeClass));
    
    // Add active to current
    element.classList.add(this.options.activeClass);
    
    // Update target content
    if (targetSelector) {
      const target = this.container.querySelector(targetSelector);
      if (target) {
        const dataKey = element.dataset[this.options.dataAttr.replace('data-', '')];
        return target;
      }
    }
  }

  updateContent(targetSelector, content) {
    const target = this.container.querySelector(targetSelector);
    if (target) {
      // Use textContent for safety, or allow HTML via option
      if (this.options.allowHTML) {
        target.innerHTML = content;
      } else {
        target.textContent = content;
      }
    }
  }
}

export default InteractiveManager;
