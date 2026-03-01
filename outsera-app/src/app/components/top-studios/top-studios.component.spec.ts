import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChangeDetectorRef } from '@angular/core';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { TopStudiosComponent } from './top-studios.component';
import { MovieService } from '../../services/movie.service';
import { StudioCount } from '../../models/movie.model';

describe('TopStudiosComponent', () => {
  let component: TopStudiosComponent;
  let fixture: ComponentFixture<TopStudiosComponent>;
  let movieService: any;
  let cdr: any;

  const mockStudiosData = {
    studios: [
      { name: 'Columbia Pictures', winCount: 7 },
      { name: 'Paramount Pictures', winCount: 6 },
      { name: 'Warner Bros.', winCount: 5 },
      { name: 'Universal Studios', winCount: 4 },
      { name: 'MGM', winCount: 3 }
    ]
  };

  beforeEach(async () => {
    const movieServiceSpy = {
      getStudiosWithWinCount: vi.fn()
    };
    const cdrSpy = {
      detectChanges: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [TopStudiosComponent, HttpClientTestingModule],
      providers: [
        { provide: MovieService, useValue: movieServiceSpy },
        { provide: ChangeDetectorRef, useValue: cdrSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TopStudiosComponent);
    component = fixture.componentInstance;
    movieService = TestBed.inject(MovieService);
    cdr = TestBed.inject(ChangeDetectorRef);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.topStudios).toEqual([]);
    expect(component.loading).toBeFalsy();
    expect(component.error).toBeNull();
  });

  it('should load top 3 studios on init', () => {
    movieService.getStudiosWithWinCount.mockReturnValue(of(mockStudiosData));

    component.ngOnInit();

    expect(movieService.getStudiosWithWinCount).toHaveBeenCalled();
    expect(component.topStudios.length).toBe(3);
    expect(component.topStudios[0].name).toBe('Columbia Pictures');
    expect(component.topStudios[1].name).toBe('Paramount Pictures');
    expect(component.topStudios[2].name).toBe('Warner Bros.');
    expect(component.loading).toBeFalsy();
    expect(component.error).toBeNull();
  });

  it('should handle loading error', () => {
    const errorMessage = 'Server error';
    movieService.getStudiosWithWinCount.mockReturnValue(
      throwError(() => ({ message: errorMessage }))
    );

    component.ngOnInit();

    expect(component.loading).toBeFalsy();
    expect(component.error).toBe('Error loading top studios');
    expect(component.topStudios).toEqual([]);
  });

});