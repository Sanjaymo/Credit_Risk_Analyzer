import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PredictionService } from '../../services/prediction.service';

@Component({
  selector: 'app-model-explanation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './model-explanation.component.html',
  styleUrl: './model-explanation.component.css'
})
export class ModelExplanationComponent implements OnInit {
  modelInfo: any = null;
  loading = true;
  error = '';

  pipelineSteps = [
    { icon: 'fa-database', title: 'Data Collection', desc: '10,000 synthetic loan records generated' },
    { icon: 'fa-broom', title: 'Data Cleaning', desc: 'Handle missing values, outlier detection' },
    { icon: 'fa-cogs', title: 'Feature Engineering', desc: '6 key financial features selected' },
    { icon: 'fa-brain', title: 'Model Training', desc: 'Logistic Regression with StandardScaler' },
    { icon: 'fa-chart-line', title: 'Model Evaluation', desc: 'Accuracy, Precision, Recall, F1 Score' },
    { icon: 'fa-rocket', title: 'Deployment', desc: 'Flask API + Express.js + Angular frontend' }
  ];

  constructor(private predictionService: PredictionService) {}

  ngOnInit() {
    this.predictionService.getModelInfo().subscribe({
      next: (info) => {
        this.modelInfo = info;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load model info. Ensure services are running.';
        this.loading = false;
      }
    });
  }

  getConfusionValue(row: number, col: number): number {
    if (!this.modelInfo?.confusion_matrix) return 0;
    return this.modelInfo.confusion_matrix[row][col];
  }
}
