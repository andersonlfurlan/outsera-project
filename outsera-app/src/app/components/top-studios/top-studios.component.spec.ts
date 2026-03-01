import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { TopStudiosComponent } from './top-studios.component';
import { DashboardStore } from '../../stores/dashboard.store';
import { StudioCount } from '../../models/movie.model';

describe('TopStudiosComponent', () => {
  let component: TopStudiosComponent;
  let fixture: ComponentFixture<TopStudiosComponent>;
  let dashboardStore: any;
  let cdr: any;

  const mockStudiosData: StudioCount[] = [
    { name: 'Columbia Pictures', winCount: 7 },
    { name: 'Paramount Pictures', winCount: 6 },
    { name: 'Warner Bros.', winCount: 5 }
  ];

  beforeEach(async () => {
    const dashboardStoreSpy = {
      studiosWithWinCount$: new BehaviorSubject<StudioCount[]>([]),
      loading$: new BehaviorSubject<boolean>(false),
      error$: new BehaviorSubject<string | null>(null),
      loadStudiosWithWinCount: vi.fn()
    };
    
    const cdrSpy = {
      detectChanges: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [TopStudiosComponent, HttpClientTestingModule],
      providers: [
        { provide: DashboardStore, useValue: dashboardStoreSpy },
        { provide: ChangeDetectorRef, useValue: cdrSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TopStudiosComponent);
    component = fixture.componentInstance;
    dashboardStore = TestBed.inject(DashboardStore);
    cdr = TestBed.inject(ChangeDetectorRef);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize observables from store', () => {
    expect(component.studiosWithWinCount$).toBeTruthy();
    expect(component.loading$).toBeTruthy();
    expect(component.error$).toBeTruthy();
  });

  it('should load top studios on init', () => {
    component.ngOnInit();
    expect(dashboardStore.loadStudiosWithWinCount).toHaveBeenCalled();
  });

});