import { Injectable } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { MaxMinInterval, StudioCount, YearMultipleWinner, Movie } from '../models/movie.model';
import { MovieService } from '../services/movie.service';
import { BaseStore, BaseState } from './base.store';

export interface DashboardState extends BaseState {
  yearsWithMultipleWinners: YearMultipleWinner[];
  studiosWithWinCount: StudioCount[];
  producerIntervals: MaxMinInterval;
  movieWinnersByYear: {
    year: number | null;
    movies: Movie[];
  };
}

const initialState: DashboardState = {
  yearsWithMultipleWinners: [],
  studiosWithWinCount: [],
  producerIntervals: { min: [], max: [] },
  movieWinnersByYear: {
    year: null,
    movies: []
  },
  loading: false,
  error: null
};

@Injectable({
  providedIn: 'root'
})
export class DashboardStore extends BaseStore<DashboardState> {

  constructor(private movieService: MovieService) {
    super(initialState);
  }

  yearsWithMultipleWinners$ = this.select('yearsWithMultipleWinners');
  studiosWithWinCount$ = this.select('studiosWithWinCount');
  producerIntervals$ = this.select('producerIntervals');
  movieWinnersByYear$ = this.select('movieWinnersByYear');
  loading$ = this.select('loading');
  error$ = this.select('error');

  loadYearsWithMultipleWinners(): void {
    this.setLoading(true);
    this.setError(null);

    this.movieService.getYearsWithMultipleWinners().pipe(
      tap((result) => {
        this.setState({
          yearsWithMultipleWinners: result.years,
          loading: false
        });
      }),
      catchError((error) => {
        console.error('[DASHBOARD-STORE] loadYearsWithMultipleWinners ERROR', error);
        this.setError('Error loading years with multiple winners');
        this.setLoading(false);
        return of(null);
      })
    ).subscribe();
  }

  loadStudiosWithWinCount(): void {
    this.setLoading(true);
    this.setError(null);

    this.movieService.getStudiosWithWinCount().pipe(
      tap((result) => {
        const topStudios = result.studios
          .sort((a, b) => b.winCount - a.winCount)
          .slice(0, 3);
        
        this.setState({
          studiosWithWinCount: topStudios,
          loading: false
        });
      }),
      catchError((error) => {
        console.error('[DASHBOARD-STORE] loadStudiosWithWinCount ERROR', error);
        this.setError('Error loading studios data');
        this.setLoading(false);
        return of(null);
      })
    ).subscribe();
  }

  loadProducerIntervals(): void {
    this.setLoading(true);
    this.setError(null);

    this.movieService.getMaxMinWinIntervalForProducers().pipe(
      tap((result) => {
        this.setState({
          producerIntervals: result,
          loading: false
        });
      }),
      catchError((error) => {
        console.error('[DASHBOARD-STORE] loadProducerIntervals ERROR', error);
        this.setError('Error loading producer intervals');
        this.setLoading(false);
        return of(null);
      })
    ).subscribe();
  }

  loadMovieWinnersByYear(year: number): void {
    this.setLoading(true);
    this.setError(null);

    this.movieService.getWinnersByYear(year).pipe(
      tap((movies) => {
        this.setState({
          movieWinnersByYear: {
            year,
            movies
          },
          loading: false
        });
      }),
      catchError((error) => {
        console.error('[DASHBOARD-STORE] loadMovieWinnersByYear ERROR', error);
        this.setError('Error searching winners');
        this.setLoading(false);
        return of(null);
      })
    ).subscribe();
  }

  clearMovieWinnersByYear(): void {
    this.setState({
      movieWinnersByYear: {
        year: null,
        movies: []
      }
    });
  }

  loadAllDashboardData(): void {
    this.loadYearsWithMultipleWinners();
    this.loadStudiosWithWinCount();
    this.loadProducerIntervals();
  }
}