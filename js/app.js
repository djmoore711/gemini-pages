/**
 * SOLID-compliant application orchestrator
 * Dependency Inversion: All modules depend on abstractions, not concretions
 */
import TabManager from './modules/TabManager.js';
import ChartManager from './modules/ChartManager.js';
import ModalManager from './modules/ModalManager.js';
import InteractiveManager from './modules/InteractiveManager.js';
import RecommendationManager from './modules/RecommendationManager.js';

class App {
  constructor() {
    this.modules = new Map();
    this.init();
  }

  init() {
    this.initializeModules();
    this.configureRecommendations();
    this.setupCharts();
    this.bindGlobalEvents();
  }

  initializeModules() {
    // Tab managers for different sections
    this.modules.set('techTabs', new TabManager('#technologies'));
    this.modules.set('optimizationTabs', new TabManager('#optimization'));
    this.modules.set('advancedTabs', new TabManager('#advanced-features'));
    
    // Modal manager
    this.modules.set('modal', new ModalManager('#aiModal'));
    
    // Interactive managers
    this.modules.set('resolutionInteractive', new InteractiveManager('#resolution-fps'));
    this.modules.set('recommendationInteractive', new RecommendationManager('#recommendations'));
    
    // Chart manager
    this.modules.set('chart', new ChartManager('#priceComparisonChart'));
  }

  configureRecommendations() {
    const recommendationManager = this.modules.get('recommendationInteractive');
    
    // Register all recommendation content
    recommendationManager.registerRecommendation('ultimate_detail', `
      <h4 class="font-semibold text-lg mb-2 text-accent">For the Ultimate in Night Vision Detail (Front & Rear):</h4>
      <p>Focus on models with Sony STARVIS 2 sensors for <strong>both</strong> front and rear cameras, plus robust HDR on both. 4K front / 2K+ rear is ideal. Look for brands known for strong image processing and high-quality optics.</p>
      <p><strong>Example Considerations:</strong> Premium models from brands like Thinkware often lead in raw image quality due to such configurations. Scrutinize independent reviews focusing on night footage from both cameras.</p>
    `);
    
    recommendationManager.registerRecommendation('cloud_features', `
      <h4 class="font-semibold text-lg mb-2 text-accent">For Balanced Performance with Leading Cloud Features & Connectivity:</h4>
      <p>If remote access, instant notifications, and cloud backup are paramount (especially for security against theft/tampering).</p>
      <p><strong>Example Contenders:</strong> BlackVue DR970X series (especially LTE models). Despite potential trade-offs like lacking HDR on some configurations, their STARVIS 2 front sensor and cloud integration offer a strong security package.</p>
    `);
    
    recommendationManager.registerRecommendation('parking_surveillance', `
      <h4 class="font-semibold text-lg mb-2 text-accent">For Advanced Parking Surveillance with Excellent Night Vision:</h4>
      <p>Look for radar-based motion detection, buffered recording, and energy-saving modes, all supported by strong night vision technology.</p>
      <p><strong>Example Contenders:</strong> Thinkware U3000 (combines STARVIS 2 front sensor, Super Night Vision 4.0, and innovative radar parking mode).</p>
    `);
    
    recommendationManager.registerRecommendation('budget_conscious', `
      <h4 class="font-semibold text-lg mb-2 text-accent">For Budget-Conscious Buyers Still Requiring Good Night Vision:</h4>
      <p>Look for models with original Sony STARVIS sensors (or comparable), effective WDR or HDR, decent aperture, and positive user reviews on night performance. Prioritize models from reputable brands known for reliability even in their more affordable ranges.</p>
      <p><strong>Example Contenders:</strong> Vantrue S1 Pro, or other well-reviewed models in the sub-$200 to sub-$300 categories that demonstrate competent low-light recording from established brands.</p>
    `);
  }

  setupCharts() {
    const chartManager = this.modules.get('chart');
    
    const priceData = {
      labels: ['Thinkware U3000', 'BlackVue DR970X', 'Vantrue N4 Pro', 'Vantrue S1 Pro'],
      datasets: [{
        label: 'Typical Price Range (USD)',
        data: [[500, 550], [400, 541], [300, 400], [150, 200]],
        backgroundColor: ['rgba(13, 148, 136, 0.6)', 'rgba(15, 118, 110, 0.6)', 'rgba(17, 94, 89, 0.6)', 'rgba(19, 78, 74, 0.6)'],
        borderColor: ['rgb(13, 148, 136)', 'rgb(15, 118, 110)', 'rgb(17, 94, 89)', 'rgb(19, 78, 74)'],
        borderWidth: 1,
        barPercentage: 0.7,
        categoryPercentage: 0.8,
        borderSkipped: false
      }]
    };

    const chartConfig = {
      type: 'bar',
      data: priceData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Price Range (USD)'
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        }
      }
    };

    chartManager.createChart(priceData, chartConfig);
  }

  bindGlobalEvents() {
    // AI Modal functionality
    const modalManager = this.modules.get('modal');
    const askAIButton = document.getElementById('askAIButton');
    const aiQueryInput = document.getElementById('aiQueryInput');
    const aiResponseDiv = document.getElementById('aiResponseDiv');

    if (askAIButton && aiQueryInput && aiResponseDiv) {
      askAIButton.addEventListener('click', async () => {
        const query = aiQueryInput.value.trim();
        if (!query) return;

        askAIButton.disabled = true;
        aiResponseDiv.textContent = 'Thinking...';

        try {
          const response = await fetch('/api/ai-query', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
          });

          if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
          }

          const result = await response.json();
          
          if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
            const text = result.candidates[0].content.parts[0].text;
            aiResponseDiv.textContent = text;
          } else {
            aiResponseDiv.textContent = 'Sorry, I could not get a response. The AI might be unavailable.';
          }
        } catch (error) {
          console.error('Error calling Gemini API:', error);
          aiResponseDiv.textContent = `An error occurred: ${error.message}. Please try again later.`;
        } finally {
          askAIButton.disabled = false;
        }
      });
    }

    // Resolution/FPS Interactive
    const resolutionManager = this.modules.get('resolutionInteractive');
    const resFpsBtns = document.querySelectorAll('[data-info]');
    const resFpsInfoDiv = document.getElementById('res-fps-info');

    if (resFpsBtns.length > 0 && resFpsInfoDiv) {
      const resFpsData = {
        '4k30fps': "4K @ 30fps: Maximum detail for license plates and distant objects. Best in well-lit conditions. May struggle in very dark scenes due to less light per frame.",
        '2k60fps': "2K @ 60fps: Balances smoother motion with high detail. Best for fast-moving objects when ambient light is adequate. Less light per frame than 30fps.",
        '2k30fps': "2K @ 30fps: Good balance if 4K isn't available. Offers good detail with better light capture per frame than 60fps.",
        '1080p60fps': "1080p @ 60fps: Provides smoother motion but significantly less detail for license plates compared to 2K/4K. Less light per frame than 30fps."
      };

      resolutionManager.registerInteractive('[data-info]', (e) => {
        const btn = e.target;
        const dataKey = btn.dataset.info;
        
        // Update button states
        resFpsBtns.forEach(b => b.classList.remove('bg-teal-500', 'ring-2', 'ring-teal-700'));
        btn.classList.add('bg-teal-500', 'ring-2', 'ring-teal-700');
        
        // Update content
        resFpsInfoDiv.innerHTML = resFpsData[dataKey] || '<p>Select an option to learn more.</p>';
      });
    }
  }

  // Extension point for new modules
  registerModule(name, module) {
    this.modules.set(name, module);
  }

  // Extension point for new behaviors
  extendBehavior(behaviorName, behaviorFunction) {
    this[behaviorName] = behaviorFunction;
  }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.dashCamApp = new App();
});

export default App;
