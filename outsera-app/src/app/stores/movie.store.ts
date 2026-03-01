import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Movie, Page } from '../models/movie.model';
import { MovieService } from '../services/movie.service';
import { BaseStore, BaseState } from './base.store';

export interface MovieFilters {
  winner: boolean | null;
  year: number | null;
}

export interface MovieState extends BaseState {
  movies: Movie[];
  totalElements: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  filters: MovieFilters;
  availableYears: number[];
}

const initialState: MovieState = {
  movies: [],
  totalElements: 0,
  currentPage: 0,
  pageSize: 10,
  totalPages: 0,
  filters: {
    winner: null,
    year: null
  },
  availableYears: [],
  loading: false,
  error: null
};

@Injectable({
  providedIn: 'root'
})
export class MovieStore extends BaseStore<MovieState> {

  constructor(private movieService: MovieService) {
    super(initialState);
    this.loadAvailableYears();
  }

  // Selectors
  movies$ = this.select('movies');
  totalElements$ = this.select('totalElements');
  currentPage$ = this.select('currentPage');
  pageSize$ = this.select('pageSize');
  totalPages$ = this.select('totalPages');
  filters$ = this.select('filters');
  availableYears$ = this.select('availableYears');
  loading$ = this.select('loading');
  error$ = this.select('error');

  // Actions
  loadMovies(): void {
    this.setLoading(true);
    this.setError(null);

    const state = this.getState();
    
    this.movieService.getMovies(
      state.currentPage,
      state.pageSize,
      state.filters.winner !== null ? state.filters.winner : undefined,
      state.filters.year !== null ? state.filters.year : undefined
    ).pipe(
      tap((data: Page<Movie>) => {
        this.setState({
          movies: data.content,
          totalElements: data.totalElements,
          totalPages: data.totalPages,
          loading: false
        });
      }),
      catchError((error) => {
        console.error('[MOVIE-STORE] loadMovies ERROR', error);
        this.setError('Erro ao carregar filmes');
        this.setLoading(false);
        return of(null);
      })
    ).subscribe();
  }

  setPage(page: number): void {
    this.setState({
      currentPage: page
    });
    this.loadMovies();
  }

  setPageSize(pageSize: number): void {
    this.setState({
      currentPage: 0,
      pageSize
    });
    this.loadMovies();
  }

  setFilters(filters: Partial<MovieFilters>): void {
    this.setState({
      currentPage: 0,
      filters: {
        ...this.getState().filters,
        ...filters
      }
    });
    this.loadMovies();
  }

  clearFilters(): void {
    this.setState({
      currentPage: 0,
      filters: {
        winner: null,
        year: null
      }
    });
    this.loadMovies();
  }

  private loadAvailableYears(): void {
    this.movieService.getAllMovies().pipe(
      map((data: Page<Movie>) => {
        const years = new Set(data.content.map(m => m.year));
        return Array.from(years).sort((a, b) => b - a);
      }),
      tap((years) => {
        this.setState({
          availableYears: years
        });
      }),
      catchError((error) => {
        console.error('[MOVIE-STORE] loadAvailableYears ERROR', error);
        return of([]);
      })
    ).subscribe();
  }

  // Navigation helpers
  goToFirstPage(): void {
    this.setPage(0);
  }

  goToPreviousPage(): void {
    const currentPage = this.getState().currentPage;
    if (currentPage > 0) {
      this.setPage(currentPage - 1);
    }
  }

  goToNextPage(): void {
    const state = this.getState();
    if (state.currentPage < state.totalPages - 1) {
      this.setPage(state.currentPage + 1);
    }
  }

  goToLastPage(): void {
    const totalPages = this.getState().totalPages;
    if (totalPages > 0) {
      this.setPage(totalPages - 1);
    }
  }
}