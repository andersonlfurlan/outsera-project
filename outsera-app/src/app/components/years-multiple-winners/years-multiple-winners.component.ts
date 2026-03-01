import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { DashboardStore } from '../../stores';
import { YearMultipleWinner } from '../../models/movie.model';

@Component({
  selector: 'app-years-multiple-winners',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './years-multiple-winners.component.html',
  styleUrl: './years-multiple-winners.component.css'
})
export class YearsMultipleWinnersComponent implements OnInit {
  // Observable state from store
  yearsWithMultipleWinners$: Observable<YearMultipleWinner[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(private dashboardStore: DashboardStore, private cdr: ChangeDetectorRef) {
    // Initialize observables after dashboardStore is available
    this.yearsWithMultipleWinners$ = this.dashboardStore.yearsWithMultipleWinners$;
    this.loading$ = this.dashboardStore.loading$;
    this.error$ = this.dashboardStore.error$;
  }

  ngOnInit(): void {
    this.dashboardStore.loadYearsWithMultipleWinners();
  }
}