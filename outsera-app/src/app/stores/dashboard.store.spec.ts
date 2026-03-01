import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { DashboardStore } from './dashboard.store';
import { MovieService } from '../services/movie.service';
import { MaxMinInterval, StudioCount, YearMultipleWinner, Movie } from '../models/movie.model';

describe('DashboardStore', () => {
  let store: DashboardStore;
  let movieService: any;

  const mockYearsData = {
    years: [
      { year: 1986, winnerCount: 2 },
      { year: 1990, winnerCount: 2 }
    ]
  };

  const mockStudiosData = {
    studios: [
      { name: 'Columbia Pictures', winCount: 7 },
      { name: 'Paramount Pictures', winCount: 6 }
    ]
  };

  const mockIntervalData: MaxMinInterval = {
    min: [
      {
        producer: 'Joel Silver',
        interval: 1,
        previousWin: 1990,
        followingWin: 1991
      }
    ],
    max: [
      {
        producer: 'Matthew Vaughn',
        interval: 13,
        previousWin: 2004,
        followingWin: 2017
      }
    ]
  };

  const mockMovies: Movie[] = [
    {
      id: 1,
      year: 1980,
      title: 'Test Movie',
      studios: ['Test Studio'],
      producers: ['Test Producer'],
      winner: true
    }
  ];

  beforeEach(() => {
    const movieServiceSpy = {
      getYearsWithMultipleWinners: vi.fn().mockReturnValue(of(mockYearsData)),
      getStudiosWithWinCount: vi.fn().mockReturnValue(of(mockStudiosData)),
      getMaxMinWinIntervalForProducers: vi.fn().mockReturnValue(of(mockIntervalData)),
      getWinnersByYear: vi.fn().mockReturnValue(of(mockMovies))
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DashboardStore,
        { provide: MovieService, useValue: movieServiceSpy }
      ]
    });

    store = TestBed.inject(DashboardStore);
    movieService = TestBed.inject(MovieService);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should load years with multiple winners', async () => {
    store.loadYearsWithMultipleWinners();

    await new Promise(resolve => setTimeout(resolve, 100));

    const years = await new Promise<YearMultipleWinner[]>(resolve => {
      store.yearsWithMultipleWinners$.subscribe(y => resolve(y));
    });

    expect(years).toEqual(mockYearsData.years);
    expect(movieService.getYearsWithMultipleWinners).toHaveBeenCalled();
  });

  it('should load studios with win count', async () => {
    store.loadStudiosWithWinCount();

    await new Promise(resolve => setTimeout(resolve, 100));

    const studios = await new Promise<StudioCount[]>(resolve => {
      store.studiosWithWinCount$.subscribe(s => resolve(s));
    });

    expect(studios).toEqual(mockStudiosData.studios);
    expect(movieService.getStudiosWithWinCount).toHaveBeenCalled();
  });

  it('should load producer intervals', async () => {
    store.loadProducerIntervals();

    await new Promise(resolve => setTimeout(resolve, 100));

    const intervals = await new Promise<MaxMinInterval>(resolve => {
      store.producerIntervals$.subscribe(i => resolve(i));
    });

    expect(intervals).toEqual(mockIntervalData);
    expect(movieService.getMaxMinWinIntervalForProducers).toHaveBeenCalled();
  });

  it('should load movie winners by year', async () => {
    const year = 1980;
    store.loadMovieWinnersByYear(year);

    await new Promise(resolve => setTimeout(resolve, 100));

    const data = await new Promise<{ year: number | null; movies: Movie[] }>(resolve => {
      store.movieWinnersByYear$.subscribe(d => resolve(d));
    });

    expect(data.year).toBe(year);
    expect(data.movies).toEqual(mockMovies);
    expect(movieService.getWinnersByYear).toHaveBeenCalledWith(year);
  });

  it('should handle error when loading years with multiple winners', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    movieService.getYearsWithMultipleWinners.mockReturnValue(
      throwError(() => new Error('Test error'))
    );

    store.loadYearsWithMultipleWinners();

    await new Promise(resolve => setTimeout(resolve, 100));

    const error = await new Promise<string | null>(resolve => {
      store.error$.subscribe(e => resolve(e));
    });

    expect(error).toBe('Error loading years with multiple winners');
    
    consoleErrorSpy.mockRestore();
  });

  it('should handle error when loading studios', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    movieService.getStudiosWithWinCount.mockReturnValue(
      throwError(() => new Error('Test error'))
    );

    store.loadStudiosWithWinCount();

    await new Promise(resolve => setTimeout(resolve, 100));

    const error = await new Promise<string | null>(resolve => {
      store.error$.subscribe(e => resolve(e));
    });

    expect(error).toBe('Error loading studios data');
    
    consoleErrorSpy.mockRestore();
  });

  it('should handle error when loading producer intervals', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    movieService.getMaxMinWinIntervalForProducers.mockReturnValue(
      throwError(() => new Error('Test error'))
    );

    store.loadProducerIntervals();

    await new Promise(resolve => setTimeout(resolve, 100));

    const error = await new Promise<string | null>(resolve => {
      store.error$.subscribe(e => resolve(e));
    });

    expect(error).toBe('Error loading producer intervals');
    
    consoleErrorSpy.mockRestore();
  });

  it('should handle error when loading movie winners by year', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    movieService.getWinnersByYear.mockReturnValue(
      throwError(() => new Error('Test error'))
    );

    store.loadMovieWinnersByYear(1980);

    await new Promise(resolve => setTimeout(resolve, 100));

    const error = await new Promise<string | null>(resolve => {
      store.error$.subscribe(e => resolve(e));
    });

    expect(error).toBe('Error searching winners');
    
    consoleErrorSpy.mockRestore();
  });

  it('should set loading state', async () => {
    let loadingStates: boolean[] = [];

    const subscription = store.loading$.subscribe(loading => {
      loadingStates.push(loading);
    });

    store.loadYearsWithMultipleWinners();

    await new Promise(resolve => setTimeout(resolve, 100));

    subscription.unsubscribe();

    expect(loadingStates).toContain(true);
    expect(loadingStates).toContain(false);
  });
});
