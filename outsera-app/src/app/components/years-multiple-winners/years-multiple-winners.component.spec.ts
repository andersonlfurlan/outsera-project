import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChangeDetectorRef } from '@angular/core';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { YearsMultipleWinnersComponent } from './years-multiple-winners.component';
import { MovieService } from '../../services/movie.service';
import { YearMultipleWinner } from '../../models/movie.model';

describe('YearsMultipleWinnersComponent', () => {
  let component: YearsMultipleWinnersComponent;
  let fixture: ComponentFixture<YearsMultipleWinnersComponent>;
  let movieService: any;
  let cdr: any;

  const mockYearsData = {
    years: [
      { year: 1986, winnerCount: 2 },
      { year: 1990, winnerCount: 2 },
      { year: 2015, winnerCount: 2 }
    ]
  };

  beforeEach(async () => {
    const movieServiceSpy = {
      getYearsWithMultipleWinners: vi.fn()
    };
    const cdrSpy = {
      detectChanges: vi.fn(),
      markForCheck: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [YearsMultipleWinnersComponent, HttpClientTestingModule],
      providers: [
        { provide: MovieService, useValue: movieServiceSpy },
        { provide: ChangeDetectorRef, useValue: cdrSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(YearsMultipleWinnersComponent);
    component = fixture.componentInstance;
    movieService = TestBed.inject(MovieService);
    cdr = TestBed.inject(ChangeDetectorRef);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.yearsWithMultipleWinners).toEqual([]);
    expect(component.loading).toBeFalsy();
    expect(component.error).toBeNull();
  });

  it('should load years with multiple winners on init', () => {
    movieService.getYearsWithMultipleWinners.mockReturnValue(of(mockYearsData));

    component.ngOnInit();

    expect(movieService.getYearsWithMultipleWinners).toHaveBeenCalled();
    expect(component.yearsWithMultipleWinners).toEqual(mockYearsData.years);
    expect(component.loading).toBeFalsy();
    expect(component.error).toBeNull();
  });

  it('should handle loading error', () => {
    const errorMessage = 'Server error';
    movieService.getYearsWithMultipleWinners.mockReturnValue(
      throwError(() => ({ message: errorMessage }))
    );

    component.ngOnInit();

    expect(component.loading).toBeFalsy();
    expect(component.error).toBe('Error loading years with multiple winners');
    expect(component.yearsWithMultipleWinners).toEqual([]);
  });

  it('should handle error without message', () => {
    movieService.getYearsWithMultipleWinners.mockReturnValue(
      throwError(() => ({}))
    );

    component.ngOnInit();

    expect(component.error).toBe('Error loading years with multiple winners');
  });

  it('should display years data in table', () => {
    movieService.getYearsWithMultipleWinners.mockReturnValue(of(mockYearsData));
    component.yearsWithMultipleWinners = mockYearsData.years;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const tableRows = compiled.querySelectorAll('tbody tr');
    expect(tableRows.length).toBe(3);

    const firstRowCells = tableRows[0].querySelectorAll('td');
    expect(firstRowCells[0].textContent?.trim()).toBe('1986');
    expect(firstRowCells[1].textContent?.trim()).toBe('2');
  });

  it('should display correct table headers', () => {
    movieService.getYearsWithMultipleWinners.mockReturnValue(of(mockYearsData));
    component.yearsWithMultipleWinners = mockYearsData.years;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const headers = compiled.querySelectorAll('th');
    expect(headers[0].textContent?.trim()).toBe('Year');
    expect(headers[1].textContent?.trim()).toBe('Win Count');
  });

  it('should display no data message when empty', () => {    movieService.getYearsWithMultipleWinners.mockReturnValue(of({ years: [] }));    component.yearsWithMultipleWinners = [];
    component.loading = false;
    component.error = null;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const noDataElement = compiled.querySelector('.no-data');
    expect(noDataElement?.textContent).toContain('No years with multiple winners found');
  });

  it('should set loading to false after data is loaded', () => {
    movieService.getYearsWithMultipleWinners.mockReturnValue(of(mockYearsData));

    expect(component.loading).toBeFalsy();
    component.ngOnInit();
    expect(component.loading).toBeFalsy();
  });
});