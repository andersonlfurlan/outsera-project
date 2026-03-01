import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChangeDetectorRef } from '@angular/core';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { ProducerIntervalsComponent } from './producer-intervals.component';
import { MovieService } from '../../services/movie.service';
import { MaxMinInterval } from '../../models/movie.model';

describe('ProducerIntervalsComponent', () => {
  let component: ProducerIntervalsComponent;
  let fixture: ComponentFixture<ProducerIntervalsComponent>;
  let movieService: any;
  let cdr: any;

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

  beforeEach(async () => {
    const movieServiceSpy = {
      getMaxMinWinIntervalForProducers: vi.fn()
    };
    const cdrSpy = {
      detectChanges: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ProducerIntervalsComponent, HttpClientTestingModule],
      providers: [
        { provide: MovieService, useValue: movieServiceSpy },
        { provide: ChangeDetectorRef, useValue: cdrSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProducerIntervalsComponent);
    component = fixture.componentInstance;
    movieService = TestBed.inject(MovieService);
    cdr = TestBed.inject(ChangeDetectorRef);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.producerIntervals).toEqual({ min: [], max: [] });
    expect(component.loading).toBeFalsy();
    expect(component.error).toBeNull();
  });

  it('should load producer intervals on init', () => {
    movieService.getMaxMinWinIntervalForProducers.mockReturnValue(of(mockIntervalData));

    component.ngOnInit();

    expect(movieService.getMaxMinWinIntervalForProducers).toHaveBeenCalled();
    expect(component.producerIntervals).toEqual(mockIntervalData);
    expect(component.loading).toBeFalsy();
    expect(component.error).toBeNull();
  });

  it('should handle loading error', () => {
    const errorMessage = 'Server error';
    movieService.getMaxMinWinIntervalForProducers.mockReturnValue(
      throwError(() => ({ message: errorMessage }))
    );

    component.ngOnInit();

    expect(component.loading).toBeFalsy();
    expect(component.error).toBe('Error loading producer intervals');
    expect(component.producerIntervals).toEqual({ min: [], max: [] });
  });

});