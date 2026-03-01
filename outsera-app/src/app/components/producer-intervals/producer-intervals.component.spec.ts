import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { ProducerIntervalsComponent } from './producer-intervals.component';
import { DashboardStore } from '../../stores/dashboard.store';
import { MaxMinInterval } from '../../models/movie.model';

describe('ProducerIntervalsComponent', () => {
  let component: ProducerIntervalsComponent;
  let fixture: ComponentFixture<ProducerIntervalsComponent>;
  let dashboardStore: any;
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
    const dashboardStoreSpy = {
      producerIntervals$: new BehaviorSubject<MaxMinInterval>({ min: [], max: [] }),
      loading$: new BehaviorSubject<boolean>(false),
      error$: new BehaviorSubject<string | null>(null),
      loadProducerIntervals: vi.fn()
    };
    
    const cdrSpy = {
      detectChanges: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ProducerIntervalsComponent, HttpClientTestingModule],
      providers: [
        { provide: DashboardStore, useValue: dashboardStoreSpy },
        { provide: ChangeDetectorRef, useValue: cdrSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProducerIntervalsComponent);
    component = fixture.componentInstance;
    dashboardStore = TestBed.inject(DashboardStore);
    cdr = TestBed.inject(ChangeDetectorRef);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize observables from store', () => {
    expect(component.producerIntervals$).toBeTruthy();
    expect(component.loading$).toBeTruthy();
    expect(component.error$).toBeTruthy();
  });

  it('should load producer intervals on init', () => {
    component.ngOnInit();
    expect(dashboardStore.loadProducerIntervals).toHaveBeenCalled();
  });

});