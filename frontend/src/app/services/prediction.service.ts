import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PredictionInput {
  age: number;
  monthlyIncome: number;
  loanAmount: number;
  creditScore: number;
  employmentYears: number;
  existingLoans: number;
}

export interface PredictionResult {
  defaultProbability: number;
  riskLevel: string;
  recommendation: string;
  id?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PredictionService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  predict(data: PredictionInput): Observable<PredictionResult> {
    return this.http.post<PredictionResult>(`${this.apiUrl}/predict`, data);
  }

  getPredictions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/predictions`);
  }

  getStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }

  getModelInfo(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/model-info`);
  }
}
