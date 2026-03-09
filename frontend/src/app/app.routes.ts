import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PredictionComponent } from './components/prediction/prediction.component';
import { VisualizationComponent } from './components/visualization/visualization.component';
import { ModelExplanationComponent } from './components/model-explanation/model-explanation.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'prediction', component: PredictionComponent },
  { path: 'visualization', component: VisualizationComponent },
  { path: 'model', component: ModelExplanationComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: '**', redirectTo: '' }
];
