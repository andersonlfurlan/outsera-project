import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MoviesListComponent } from './pages/movies-list/movies-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'movies', component: MoviesListComponent },
  { path: '**', redirectTo: '/dashboard' },
];
