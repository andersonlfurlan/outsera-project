import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { YearsMultipleWinnersComponent } from './years-multiple-winners.component';
import { DashboardStore } from '../../stores/dashboard.store';
import { YearMultipleWinner } from '../../models/movie.model';

describe('YearsMultipleWinnersComponent', () => {
  let component: YearsMultipleWinnersComponent;
  let fixture: ComponentFixture<YearsMultipleWinnersComponent>;
  let dashboardStore: any;
  let cdr: any;

  const mockYearsData: YearMultipleWinner[] = [
    { year: 1986, winnerCount: 2 },
    { year: 1990, winnerCount: 2 },
    { year: 2015, winnerCount: 2 }
  ];

  beforeEach(async () => {
    const dashboardStoreSpy = {
      yearsWithMultipleWinners$: new BehaviorSubject<YearMultipleWinner[]>([]),
      loading$: new BehaviorSubject<boolean>(false),
      error$: new BehaviorSubject<string | null>(null),
      loadYearsWithMultipleWinners: vi.fn()
    };
    
    const cdrSpy = {
      detectChanges: vi.fn(),
      markForCheck: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [YearsMultipleWinnersComponent, HttpClientTestingModule],
      providers: [
        { provide: DashboardStore, useValue: dashboardStoreSpy },
        { provide: ChangeDetectorRef, useValue: cdrSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(YearsMultipleWinnersComponent);
    component = fixture.componentInstance;
    dashboardStore = TestBed.inject(DashboardStore);
    cdr = TestBed.inject(ChangeDetectorRef);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize observables from store', () => {
    expect(component.yearsWithMultipleWinners$).toBeTruthy();
    expect(component.loading$).toBeTruthy();
    expect(component.error$).toBeTruthy();
  });

  it('should load years with multiple winners on init', () => {
    component.ngOnInit();
    expect(dashboardStore.loadYearsWithMultipleWinners).toHaveBeenCalled();
  });
});