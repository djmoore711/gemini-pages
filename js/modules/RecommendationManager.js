/**
 * RecommendationManager - Single Responsibility: Managing priority-based recommendations
 * Open/Closed Principle: New recommendation types can be added without modifying core
 */
class RecommendationManager {
  constructor(containerSelector, options = {}) {
    this.container = document.querySelector(containerSelector);
    this.options = {
      buttonSelector: '.priority-btn',
      targetSelector: '.recommendation-target',
      activeClass: 'selected',
      ...options
    };
    this.recommendations = new Map();
  }

  registerRecommendation(key, content) {
    this.recommendations.set(key, content);
  }

  init() {
    if (!this.container) return;
    this.bindEvents();
  }

  bindEvents() {
    const buttons = this.container.querySelectorAll(this.options.buttonSelector);
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        this.handleRecommendation(e.target);
      });
    });
  }

  handleRecommendation(button) {
    const priority = button.dataset.priority;
    if (!priority) return;

    // Update button states
    const buttons = this.container.querySelectorAll(this.options.buttonSelector);
    buttons.forEach(btn => btn.classList.remove(this.options.activeClass));
    button.classList.add(this.options.activeClass);

    // Update content
    const target = this.container.querySelector(this.options.targetSelector);
    if (target) {
      const content = this.recommendations.get(priority);
      if (content) {
        target.innerHTML = content;
      }
    }
  }

  getRecommendation(key) {
    return this.recommendations.get(key);
  }
}

export default RecommendationManager;
