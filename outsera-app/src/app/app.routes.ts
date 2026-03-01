import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MoviesListComponent } from './components/movies-list/movies-list.component';

export const routes: Routes = [
  { path: 'movies', component: MoviesListComponent },
];
