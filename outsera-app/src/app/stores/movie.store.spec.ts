import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { MovieStore } from './movie.store';
import { MovieService } from '../services/movie.service';
import { Movie, Page } from '../models/movie.model';

describe('MovieStore', () => {
  let store: MovieStore;
  let movieService: any;

  const mockMoviesPage: Page<Movie> = {
    content: [
      {
        id: 1,
        year: 1980,
        title: 'Test Movie 1',
        studios: ['Test Studio 1'],
        producers: ['Test Producer 1'],
        winner: true
      }
    ],
    number: 0,
    size: 10,
    totalElements: 1,
    totalPages: 1,
    first: true,
    last: true,
    numberOfElements: 1,
    empty: false,
    pageable: {
      pageNumber: 0,
      unpaged: false,
      paged: true,
      pageSize: 10,
      offset: 0
    },
    sort: {
      unsorted: true,
      sorted: false,
      empty: true
    }
  };

  beforeEach(() => {
    const movieServiceSpy = {
      getMovies: vi.fn().mockReturnValue(of(mockMoviesPage)),
      getAllMovies: vi.fn().mockReturnValue(of(mockMoviesPage))
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        MovieStore,
        { provide: MovieService, useValue: movieServiceSpy }
      ]
    });

    store = TestBed.inject(MovieStore);
    movieService = TestBed.inject(MovieService);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should load movies', async () => {
    store.loadMovies();

    await new Promise(resolve => setTimeout(resolve, 100));

    const movies = await new Promise<Movie[]>(resolve => {
      store.movies$.subscribe(m => resolve(m));
    });

    expect(movies).toEqual(mockMoviesPage.content);
    expect(movieService.getMovies).toHaveBeenCalled();
  });

  it('should update total elements after loading movies', async () => {
    store.loadMovies();

    await new Promise(resolve => setTimeout(resolve, 100));

    const total = await new Promise<number>(resolve => {
      store.totalElements$.subscribe(t => resolve(t));
    });

    expect(total).toBe(1);
  });

  it('should set filters', async () => {
    const filters = { winner: true, year: 2000 };
    store.setFilters(filters);

    const currentFilters = await new Promise(resolve => {
      store.filters$.subscribe(f => resolve(f));
    });

    expect(currentFilters).toEqual(filters);
  });

  it('should clear filters', async () => {
    store.setFilters({ winner: true, year: 2000 });
    store.clearFilters();

    const filters = await new Promise<any>(resolve => {
      store.filters$.subscribe(f => resolve(f));
    });

    expect(filters.winner).toBeNull();
    expect(filters.year).toBeNull();
  });

  it('should navigate to next page', async () => {
    // Start with page 0 and totalPages = 1, so we can't go to next page
    // First, let's ensure we have multiple pages
    const mockMultiplePagesResponse: Page<Movie> = {
      ...mockMoviesPage,
      totalPages: 3
    };
    
    movieService.getMovies.mockReturnValue(of(mockMultiplePagesResponse));
    
    store.loadMovies();
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    store.goToNextPage();

    await new Promise(resolve => setTimeout(resolve, 100));

    const page = await new Promise<number>(resolve => {
      store.currentPage$.subscribe(p => resolve(p));
    });

    expect(page).toBe(1);
  });

  it('should navigate to previous page', async () => {
    store.setPage(1);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    store.goToPreviousPage();

    await new Promise(resolve => setTimeout(resolve, 100));

    const page = await new Promise<number>(resolve => {
      store.currentPage$.subscribe(p => resolve(p));
    });

    expect(page).toBe(0);
  });

  it('should go to first page', async () => {
    store.setPage(5);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    store.goToFirstPage();

    await new Promise(resolve => setTimeout(resolve, 100));

    const page = await new Promise<number>(resolve => {
      store.currentPage$.subscribe(p => resolve(p));
    });

    expect(page).toBe(0);
  });

  it('should handle error when loading movies', async () => {
    // Silenciar console.error para este teste
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    movieService.getMovies.mockReturnValue(
      throwError(() => new Error('Test error'))
    );

    store.loadMovies();

    await new Promise(resolve => setTimeout(resolve, 100));

    const error = await new Promise<string | null>(resolve => {
      store.error$.subscribe(e => resolve(e));
    });

    expect(error).toBe('Erro ao carregar filmes');
    
    // Restaurar console.error
    consoleErrorSpy.mockRestore();
  });

  it('should set loading state', async () => {
    let loadingStates: boolean[] = [];

    const subscription = store.loading$.subscribe(loading => {
      loadingStates.push(loading);
    });

    store.loadMovies();

    await new Promise(resolve => setTimeout(resolve, 100));

    subscription.unsubscribe();

    expect(loadingStates).toContain(true);
    expect(loadingStates).toContain(false);
  });
});
