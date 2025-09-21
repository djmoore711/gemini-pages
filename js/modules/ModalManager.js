/**
 * ModalManager - Single Responsibility: Managing modal operations
 * Open/Closed Principle: New modal behaviors can be added via extension
 */
class ModalManager {
  constructor(modalSelector, options = {}) {
    this.modal = document.querySelector(modalSelector);
    this.options = {
      openClass: 'block',
      closeClass: 'hidden',
      closeButton: '.close-button',
      ...options
    };
    this.init();
  }

  init() {
    if (!this.modal) return;
    this.bindEvents();
  }

  bindEvents() {
    // Close button
    const closeBtn = this.modal.querySelector(this.options.closeButton);
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    // Close on backdrop click
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });
  }

  open() {
    if (!this.modal) return;
    this.modal.classList.remove(this.options.closeClass);
    this.modal.classList.add(this.options.openClass);
  }

  close() {
    if (!this.modal) return;
    this.modal.classList.remove(this.options.openClass);
    this.modal.classList.add(this.options.closeClass);
  }

  isOpen() {
    return this.modal && this.modal.classList.contains(this.options.openClass);
  }

  setContent(content) {
    if (!this.modal) return;
    const contentArea = this.modal.querySelector('.modal-content');
    if (contentArea) {
      contentArea.innerHTML = content;
    }
  }
}

export default ModalManager;
