/**
 * TabManager - Single Responsibility: Managing tab interactions
 * Open/Closed Principle: New tab behaviors can be added without modifying core
 */
class TabManager {
  constructor(containerSelector, options = {}) {
    this.container = document.querySelector(containerSelector);
    this.options = {
      activeClass: 'active',
      contentClass: '.tab-content',
      buttonClass: '.tab-button',
      ...options
    };
    this.init();
  }

  init() {
    if (!this.container) return;
    this.bindEvents();
  }

  bindEvents() {
    this.container.addEventListener('click', (e) => {
      const button = e.target.closest(this.options.buttonClass);
      if (button) {
        this.switchTab(button);
      }
    });
  }

  switchTab(activeButton) {
    const targetId = activeButton.dataset.target;
    if (!targetId) return;

    // Remove active states
    this.container.querySelectorAll(this.options.buttonClass).forEach(btn => {
      btn.classList.remove(this.options.activeClass);
    });
    this.container.querySelectorAll(this.options.contentClass).forEach(content => {
      content.classList.remove(this.options.activeClass);
    });

    // Add active states
    activeButton.classList.add(this.options.activeClass);
    const targetContent = this.container.querySelector(`#${targetId}`);
    if (targetContent) {
      targetContent.classList.add(this.options.activeClass);
    }
  }
}

export default TabManager;
