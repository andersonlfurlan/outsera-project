import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { MovieWinnersYearComponent } from './movie-winners-year.component';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';

describe('MovieWinnersYearComponent', () => {
  let component: MovieWinnersYearComponent;
  let fixture: ComponentFixture<MovieWinnersYearComponent>;
  let movieService: any;
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
    const movieServiceSpy = {
      getWinnersByYear: vi.fn()
    };
    const cdrSpy = {
      detectChanges: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [MovieWinnersYearComponent, ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: MovieService, useValue: movieServiceSpy },
        { provide: ChangeDetectorRef, useValue: cdrSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MovieWinnersYearComponent);
    component = fixture.componentInstance;
    movieService = TestBed.inject(MovieService);
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

  it('should search winners successfully', () => {
    movieService.getWinnersByYear.mockReturnValue(of(mockMovies));
    component.searchForm.get('yearSearch')?.setValue(1980);
    
    component.searchYear();
    
    expect(movieService.getWinnersByYear).toHaveBeenCalledWith(1980);
    expect(component.winnersOfYear).toEqual(mockMovies);
    expect(component.loading).toBeFalsy();
    expect(component.error).toBeNull();
  });

  it('should handle search error', () => {
    const errorMessage = 'Server error';
    movieService.getWinnersByYear.mockReturnValue(throwError(() => ({ message: errorMessage })));
    component.searchForm.get('yearSearch')?.setValue(1980);
    
    component.searchYear();
    
    expect(component.loading).toBeFalsy();
    expect(component.error).toBe('No winners found for year 1980');
    expect(component.winnersOfYear).toEqual([]);
  });

  it('should not search if form is invalid', () => {
    component.searchForm.get('yearSearch')?.setValue(null);
    
    component.searchYear();
    
    expect(movieService.getWinnersByYear).not.toHaveBeenCalled();
  });

});