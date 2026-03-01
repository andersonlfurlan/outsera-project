import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { MovieWinnersYearComponent } from './movie-winners-year.component';
import { DashboardStore } from '../../stores/dashboard.store';
import { Movie } from '../../models/movie.model';

describe('MovieWinnersYearComponent', () => {
  let component: MovieWinnersYearComponent;
  let fixture: ComponentFixture<MovieWinnersYearComponent>;
  let dashboardStore: any;
  let cdr: any;

  const mockMovies: Movie[] = [
    {
      id: 1,
      year: 1980,
      title: 'Test Movie 1',
      studios: ['Test Studio'],
      producers: ['Test Producer'],
      winner: true
    },
    {
      id: 2,
      year: 1980,
      title: 'Test Movie 2',
      studios: ['Test Studio 2'],
      producers: ['Test Producer 2'],
      winner: true
    }
  ];

  beforeEach(async () => {
    const dashboardStoreSpy = {
      movieWinnersByYear$: new BehaviorSubject<{ year: number | null; movies: Movie[] }>({
        year: null,
        movies: []
      }),
      loading$: new BehaviorSubject<boolean>(false),
      error$: new BehaviorSubject<string | null>(null),
      loadMovieWinnersByYear: vi.fn()
    };
    
    const cdrSpy = {
      detectChanges: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [MovieWinnersYearComponent, ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: DashboardStore, useValue: dashboardStoreSpy },
        { provide: ChangeDetectorRef, useValue: cdrSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MovieWinnersYearComponent);
    component = fixture.componentInstance;
    dashboardStore = TestBed.inject(DashboardStore);
    cdr = TestBed.inject(ChangeDetectorRef);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with validators', () => {
    expect(component.searchForm).toBeTruthy();
    expect(component.searchForm.get('yearSearch')).toBeTruthy();
    
    const yearControl = component.searchForm.get('yearSearch');
    expect(yearControl?.hasError('required')).toBeTruthy();
    expect(yearControl?.hasError('min')).toBeFalsy();
    expect(yearControl?.hasError('max')).toBeFalsy();
  });

  it('should validate year input correctly', () => {
    const yearControl = component.searchForm.get('yearSearch');
    
    yearControl?.setValue(1899);
    expect(yearControl?.hasError('min')).toBeTruthy();
    
    yearControl?.setValue(2031);
    expect(yearControl?.hasError('max')).toBeTruthy();
    
    yearControl?.setValue(2000);
    expect(yearControl?.valid).toBeTruthy();
  });

  it('should initialize observables from store', () => {
    expect(component.movieWinnersByYear$).toBeTruthy();
    expect(component.loading$).toBeTruthy();
    expect(component.error$).toBeTruthy();
  });

  it('should search winners successfully', () => {
    component.searchForm.get('yearSearch')?.setValue(1980);
    
    component.searchYear();
    
    expect(dashboardStore.loadMovieWinnersByYear).toHaveBeenCalledWith(1980);
  });

  it('should not search if form is invalid', () => {
    component.searchForm.get('yearSearch')?.setValue(null);
    
    component.searchYear();
    
    expect(dashboardStore.loadMovieWinnersByYear).not.toHaveBeenCalled();
  });

});