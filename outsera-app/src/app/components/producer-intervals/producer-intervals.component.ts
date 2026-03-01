import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-producer-intervals',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './producer-intervals.component.html',
  styleUrl: './producer-intervals.component.css'
})
export class ProducerIntervalsComponent implements OnInit, OnDestroy {
  producerIntervals: { min: any[]; max: any[] } = { min: [], max: [] };
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

    const subscription = this.movieService.getMaxMinWinIntervalForProducers().subscribe({
      next: (result) => {
        this.producerIntervals = result;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('[PRODUCER-INTERVALS] Error loading data:', err);
        this.error = 'Error loading producer intervals';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
    this.subscriptions.add(subscription);
  }
}