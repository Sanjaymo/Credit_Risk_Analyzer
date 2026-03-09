import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PredictionService } from '../../services/prediction.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-visualization',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './visualization.component.html',
  styleUrl: './visualization.component.css'
})
export class VisualizationComponent implements OnInit, AfterViewInit {
  @ViewChild('incomeChart') incomeChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('creditChart') creditChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('loanChart') loanChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('ageChart') ageChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('defaultPieChart') defaultPieRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('featureChart') featureChartRef!: ElementRef<HTMLCanvasElement>;

  stats: any = null;
  modelInfo: any = null;
  loading = true;
  error = '';

  constructor(private predictionService: PredictionService) {}

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {}

  loadData() {
    this.predictionService.getStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.predictionService.getModelInfo().subscribe({
          next: (info) => {
            this.modelInfo = info;
            this.loading = false;
            setTimeout(() => this.renderCharts(), 100);
          },
          error: () => {
            this.loading = false;
            this.renderCharts();
          }
        });
      },
      error: () => {
        this.error = 'Failed to load data. Ensure backend and ML services are running.';
        this.loading = false;
      }
    });
  }

  renderCharts() {
    if (!this.stats) return;

    const chartColors = {
      blue: '#4361ee',
      purple: '#7209b7',
      cyan: '#4cc9f0',
      green: '#06d6a0',
      yellow: '#ffd166',
      red: '#ef476f',
      blueBg: 'rgba(67, 97, 238, 0.6)',
      purpleBg: 'rgba(114, 9, 183, 0.6)',
      gridColor: 'rgba(42, 42, 74, 0.5)',
      textColor: '#8d99ae'
    };

    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: chartColors.textColor, font: { family: 'Inter' } } }
      },
      scales: {
        x: { ticks: { color: chartColors.textColor }, grid: { color: chartColors.gridColor } },
        y: { ticks: { color: chartColors.textColor }, grid: { color: chartColors.gridColor } }
      }
    };

    // Income vs Default Rate
    if (this.incomeChartRef && this.stats.default_by_income_bracket) {
      const data = this.stats.default_by_income_bracket;
      new Chart(this.incomeChartRef.nativeElement, {
        type: 'bar',
        data: {
          labels: Object.keys(data),
          datasets: [{
            label: 'Default Rate',
            data: Object.values(data).map((d: any) => (d.default_rate * 100).toFixed(1)),
            backgroundColor: [chartColors.green, chartColors.cyan, chartColors.blue, chartColors.yellow, chartColors.red],
            borderRadius: 6
          }]
        },
        options: { ...defaultOptions, plugins: { ...defaultOptions.plugins, legend: { display: false } } }
      });
    }

    // Credit Score vs Default Rate
    if (this.creditChartRef && this.stats.default_by_credit_bracket) {
      const data = this.stats.default_by_credit_bracket;
      new Chart(this.creditChartRef.nativeElement, {
        type: 'line',
        data: {
          labels: Object.keys(data),
          datasets: [{
            label: 'Default Rate (%)',
            data: Object.values(data).map((d: any) => (d.default_rate * 100).toFixed(1)),
            borderColor: chartColors.blue,
            backgroundColor: 'rgba(67, 97, 238, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: chartColors.blue,
            pointRadius: 6,
            pointHoverRadius: 8
          }]
        },
        options: defaultOptions
      });
    }

    // Loan Amount Distribution
    if (this.loanChartRef && this.stats.loan_amount_distribution) {
      const data = this.stats.loan_amount_distribution;
      new Chart(this.loanChartRef.nativeElement, {
        type: 'bar',
        data: {
          labels: Object.keys(data),
          datasets: [{
            label: 'Number of Loans',
            data: Object.values(data),
            backgroundColor: chartColors.purpleBg,
            borderColor: chartColors.purple,
            borderWidth: 1,
            borderRadius: 6
          }]
        },
        options: { ...defaultOptions, plugins: { ...defaultOptions.plugins, legend: { display: false } } }
      });
    }

    // Age Distribution
    if (this.ageChartRef && this.stats.age_distribution) {
      const data = this.stats.age_distribution;
      new Chart(this.ageChartRef.nativeElement, {
        type: 'doughnut',
        data: {
          labels: Object.keys(data),
          datasets: [{
            data: Object.values(data),
            backgroundColor: [chartColors.blue, chartColors.purple, chartColors.cyan, chartColors.green, chartColors.yellow],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { color: chartColors.textColor, padding: 16 } } }
        }
      });
    }

    // Default Rate Pie
    if (this.defaultPieRef && this.stats.default_rate != null) {
      const rate = this.stats.default_rate;
      new Chart(this.defaultPieRef.nativeElement, {
        type: 'pie',
        data: {
          labels: ['No Default', 'Default'],
          datasets: [{
            data: [((1 - rate) * 100).toFixed(1), (rate * 100).toFixed(1)],
            backgroundColor: [chartColors.green, chartColors.red],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { color: chartColors.textColor, padding: 16 } } }
        }
      });
    }

    // Feature Importance
    if (this.featureChartRef && this.modelInfo?.feature_importance) {
      const data = this.modelInfo.feature_importance;
      const sortedEntries = Object.entries(data).sort((a: any, b: any) => b[1] - a[1]);
      new Chart(this.featureChartRef.nativeElement, {
        type: 'bar',
        data: {
          labels: sortedEntries.map(e => e[0].replace(/_/g, ' ')),
          datasets: [{
            label: 'Importance (|coefficient|)',
            data: sortedEntries.map(e => e[1]),
            backgroundColor: chartColors.blueBg,
            borderColor: chartColors.blue,
            borderWidth: 1,
            borderRadius: 6
          }]
        },
        options: {
          ...defaultOptions,
          indexAxis: 'y' as const,
          plugins: { ...defaultOptions.plugins, legend: { display: false } }
        }
      });
    }
  }
}
