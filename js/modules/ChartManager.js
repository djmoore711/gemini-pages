/**
 * ChartManager - Single Responsibility: Managing chart creation and updates
 * Open/Closed Principle: New chart types can be added without modifying core
 */
class ChartManager {
  constructor(canvasSelector, options = {}) {
    this.canvas = document.querySelector(canvasSelector);
    this.options = {
      type: 'bar',
      responsive: true,
      maintainAspectRatio: false,
      ...options
    };
    this.chart = null;
  }

  createChart(data, config = {}) {
    if (!this.canvas) return null;

    const chartConfig = {
      type: this.options.type,
      data: data,
      options: {
        responsive: this.options.responsive,
        maintainAspectRatio: this.options.maintainAspectRatio,
        ...config.options
      }
    };

    this.chart = new Chart(this.canvas, chartConfig);
    return this.chart;
  }

  updateChart(newData) {
    if (!this.chart) return;
    this.chart.data = newData;
    this.chart.update();
  }

  destroyChart() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }
}

export default ChartManager;
