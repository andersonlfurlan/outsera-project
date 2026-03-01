import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-years-multiple-winners',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './years-multiple-winners.component.html',
  styleUrl: './years-multiple-winners.component.css'
})
export class YearsMultipleWinnersComponent implements OnInit, OnDestroy {
  yearsWithMultipleWinners: { year: number; winnerCount: number }[] = [];
  loading: boolean = false;
  error: string | null = null;

  private subscriptions = new Subscription();

  constructor(private movieService: MovieService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private loadData(): void {
    this.loading = true;
    this.error = null;

    const subscription = this.movieService.getYearsWithMultipleWinners().subscribe({
      next: (result) => {
        this.yearsWithMultipleWinners = result.years;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('[YEARS-MULTIPLE-WINNERS] Error loading data:', err);
        this.error = 'Error loading years with multiple winners';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
    this.subscriptions.add(subscription);
  }
}