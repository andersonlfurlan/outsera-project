import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { MoviesListComponent } from './movies-list.component';
import { MovieService } from '../../services/movie.service';
import { Movie, Page } from '../../models/movie.model';

describe('MoviesListComponent', () => {
  let component: MoviesListComponent;
  let fixture: ComponentFixture<MoviesListComponent>;
  let movieService: any;
  let cdr: any;

  const mockMoviesPage: Page<Movie> = {
    content: [
      {
        id: 1,
        year: 1980,
        title: 'Test Movie 1',
        studios: ['Test Studio 1'],
        producers: ['Test Producer 1'],
        winner: true
      },
      {
        id: 2,
        year: 1981,
        title: 'Test Movie 2',
        studios: ['Test Studio 2'],
        producers: ['Test Producer 2'],
        winner: false
      }
    ],
    number: 0,
    size: 10,
    totalElements: 2,
    totalPages: 1,
    first: true,
    last: true,
    numberOfElements: 2,
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

  beforeEach(async () => {
    const movieServiceSpy = {
      getMovies: vi.fn().mockReturnValue(of(mockMoviesPage)),
      getAllMovies: vi.fn().mockReturnValue(of(mockMoviesPage))
    };
    const cdrSpy = {
      detectChanges: vi.fn(),
      markForCheck: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [MoviesListComponent, HttpClientTestingModule],
      providers: [
        { provide: MovieService, useValue: movieServiceSpy },
        { provide: ChangeDetectorRef, useValue: cdrSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MoviesListComponent);
    component = fixture.componentInstance;
    movieService = TestBed.inject(MovieService);
    cdr = TestBed.inject(ChangeDetectorRef);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.movies).toEqual([]);
    expect(component.loading).toBeFalsy();
    expect(component.error).toBeNull();
    expect(component.currentPage).toBe(0);
    expect(component.pageSize).toBe(10);
    expect(component.totalElements).toBe(0);
  });

  it('should load movies on init', () => {
    component.ngOnInit();

    expect(movieService.getMovies).toHaveBeenCalled();
    expect(component.movies).toEqual(mockMoviesPage.content);
    expect(component.loading).toBeFalsy();
    expect(component.error).toBeNull();
    expect(component.totalElements).toBe(2);
  });

  it('should handle loading error', () => {
    const errorMessage = 'Server error';
    movieService.getMovies.mockReturnValue(throwError(() => ({ message: errorMessage })));

    component.ngOnInit();

    expect(component.loading).toBeFalsy();
    expect(component.error).toBe('Erro ao carregar filmes');
    expect(component.movies).toEqual([]);
  });

  it('should handle error without message', () => {
    movieService.getMovies.mockReturnValue(throwError(() => ({})));

    component.ngOnInit();

    expect(component.error).toBe('Erro ao carregar filmes');
  });

  it('should go to next page', () => {
    component.totalPages = 3;
    component.currentPage = 0;
    component.nextPage();

    expect(component.currentPage).toBe(1);
    expect(movieService.getMovies).toHaveBeenCalledWith(1, 10, undefined, undefined);
  });

  it('should go to previous page', () => {
    component.currentPage = 1;
    component.previousPage();

    expect(component.currentPage).toBe(0);
    expect(movieService.getMovies).toHaveBeenCalledWith(0, 10, undefined, undefined);
  });

  it('should go to first page', () => {
    component.currentPage = 2;
    component.totalPages = 3;
    component.goToPage(0);

    expect(component.currentPage).toBe(0);
  });

  it('should go to last page', () => {
    component.totalPages = 5;
    component.goToPage(4);

    expect(component.currentPage).toBe(4);
    expect(movieService.getMovies).toHaveBeenCalledWith(4, 10, undefined, undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
});