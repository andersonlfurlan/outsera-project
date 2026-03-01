import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BehaviorSubject } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DashboardComponent } from './dashboard.component';
import { DashboardStore } from '../../stores/dashboard.store';
import { MaxMinInterval, StudioCount, YearMultipleWinner, Movie } from '../../models/movie.model';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let dashboardStore: any;

  beforeEach(async () => {
    const dashboardStoreSpy = {
      yearsWithMultipleWinners$: new BehaviorSubject<YearMultipleWinner[]>([]),
      studiosWithWinCount$: new BehaviorSubject<StudioCount[]>([]),
      producerIntervals$: new BehaviorSubject<MaxMinInterval>({ min: [], max: [] }),
      movieWinnersByYear$: new BehaviorSubject<{ year: number | null; movies: Movie[] }>({ year: null, movies: [] }),
      loading$: new BehaviorSubject<boolean>(false),
      error$: new BehaviorSubject<string | null>(null),
      loadYearsWithMultipleWinners: vi.fn(),
      loadStudiosWithWinCount: vi.fn(),
      loadProducerIntervals: vi.fn(),
      loadMovieWinnersByYear: vi.fn(),
      loadAllDashboardData: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [DashboardComponent, HttpClientTestingModule],
      providers: [
        { provide: DashboardStore, useValue: dashboardStoreSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    dashboardStore = TestBed.inject(DashboardStore);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render dashboard container', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const dashboardContainer = compiled.querySelector('.dashboard-container, .dashboard');
    expect(dashboardContainer).toBeTruthy();
  });

  it('should contain child components', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    
    // Check for child component selectors
    const movieWinnersYear = compiled.querySelector('app-movie-winners-year');
    const yearsMultipleWinners = compiled.querySelector('app-years-multiple-winners');
    const topStudios = compiled.querySelector('app-top-studios');
    const producerIntervals = compiled.querySelector('app-producer-intervals');

    expect(movieWinnersYear).toBeTruthy();
    expect(yearsMultipleWinners).toBeTruthy();
    expect(topStudios).toBeTruthy();
    expect(producerIntervals).toBeTruthy();
  });

  it('should have proper layout structure', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    
    // Check for dashboard container class
    const layoutContainer = compiled.querySelector('.dashboard-container');
    expect(layoutContainer).toBeTruthy();
  });

  it('should display dashboard title if present', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    
    // Look for any title element
    const title = compiled.querySelector('h1, h2, .dashboard-title, .title');
    // Title is optional, so we just check if it exists and has content
    if (title) {
      expect(title.textContent?.trim().length).toBeGreaterThan(0);
    }
  });

  it('should be properly structured for responsive display', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    
    // Check that the main container exists
    const mainContainer = compiled.querySelector('.dashboard-container, .dashboard, .main-container');
    expect(mainContainer).toBeTruthy();
    
    // Check that all four child components are rendered
    const childComponents = compiled.querySelectorAll('app-movie-winners-year, app-years-multiple-winners, app-top-studios, app-producer-intervals');
    expect(childComponents.length).toBe(4);
  });
});