import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  { 
    path: 'movies', 
    loadComponent: () => import('./pages/movies-list/movies-list.component').then(m => m.MoviesListComponent)
  },
  { path: '**', redirectTo: '/dashboard' },
];
