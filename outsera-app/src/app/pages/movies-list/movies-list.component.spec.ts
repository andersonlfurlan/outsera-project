import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { MoviesListComponent } from './movies-list.component';
import { MovieStore } from '../../stores/movie.store';
import { Movie, Page } from '../../models/movie.model';
import { MovieFilters } from '../../stores/movie.store';

describe('MoviesListComponent', () => {
  let component: MoviesListComponent;
  let fixture: ComponentFixture<MoviesListComponent>;
  let movieStore: any;
  let cdr: any;

  const mockMovies: Movie[] = [
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
  ];

  beforeEach(async () => {
    const mockFilters: MovieFilters = { winner: null, year: null };
    
    const movieStoreSpy = {
      movies$: new BehaviorSubject<Movie[]>([]),
      totalElements$: new BehaviorSubject<number>(0),
      currentPage$: new BehaviorSubject<number>(0),
      pageSize$: new BehaviorSubject<number>(10),
      totalPages$: new BehaviorSubject<number>(0),
      filters$: new BehaviorSubject<MovieFilters>(mockFilters),
      availableYears$: new BehaviorSubject<number[]>([]),
      loading$: new BehaviorSubject<boolean>(false),
      error$: new BehaviorSubject<string | null>(null),
      loadMovies: vi.fn(),
      setPage: vi.fn(),
      goToNextPage: vi.fn(),
      goToPreviousPage: vi.fn(),
      goToFirstPage: vi.fn(),
      goToLastPage: vi.fn(),
      setFilters: vi.fn(),
      clearFilters: vi.fn()
    };
    
    const cdrSpy = {
      detectChanges: vi.fn(),
      markForCheck: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [MoviesListComponent, HttpClientTestingModule],
      providers: [
        { provide: MovieStore, useValue: movieStoreSpy },
        { provide: ChangeDetectorRef, useValue: cdrSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MoviesListComponent);
    component = fixture.componentInstance;
    movieStore = TestBed.inject(MovieStore);
    cdr = TestBed.inject(ChangeDetectorRef);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize observables from store', () => {
    expect(component.movies$).toBeTruthy();
    expect(component.loading$).toBeTruthy();
    expect(component.error$).toBeTruthy();
    expect(component.currentPage$).toBeTruthy();
    expect(component.totalElements$).toBeTruthy();
  });

  it('should call loadMovies on init', () => {
    component.ngOnInit();
    expect(movieStore.loadMovies).toHaveBeenCalled();
  });

  it('should call nextPage on store', () => {
    component.nextPage();
    expect(movieStore.goToNextPage).toHaveBeenCalled();
  });

  it('should call previousPage on store', () => {
    component.previousPage();
    expect(movieStore.goToPreviousPage).toHaveBeenCalled();
  });

  it('should call goToPage on store', () => {
    component.goToPage(5);
    expect(movieStore.setPage).toHaveBeenCalledWith(5);
  });

  it('should call setFilters on filter change', () => {
    component.filterWinner = true;
    component.filterYear = 2000;
    component.onFilterChange();
    expect(movieStore.setFilters).toHaveBeenCalledWith({ winner: true, year: 2000 });
  });

  it('should clear filters', () => {
    component.clearFilters();
    expect(movieStore.clearFilters).toHaveBeenCalled();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
});