import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, Subscription } from 'rxjs';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  yearsWithMultipleWinners: { year: number; winnerCount: number }[] = [];
  topStudios: { name: string; winCount: number }[] = [];
  producerIntervals: { min: any[]; max: any[] } = { min: [], max: [] };
  yearSearch: number | null = null;
  winnersOfYear: Movie[] = [];
  loading: boolean = false;
  error: string | null = null;

  private subscriptions = new Subscription();

  constructor(private movieService: MovieService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadPanels();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadPanels(): void {
    this.loading = true;
    this.error = null;

    const subscription = forkJoin({
      years: this.movieService.getYearsWithMultipleWinners(),
      studios: this.movieService.getStudiosWithWinCount(),
      intervals: this.movieService.getMaxMinWinIntervalForProducers()
    }).subscribe({
      next: (results) => {
        this.yearsWithMultipleWinners = results.years.years;
        this.topStudios = results.studios.studios.slice(0, 3);
        this.producerIntervals = results.intervals;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('[DASHBOARD] Erro ao carregar dados:', err);
        this.error = 'Erro ao carregar dados do dashboard';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
    this.subscriptions.add(subscription);
  }

  searchYear(): void {
    if (this.yearSearch === null || this.yearSearch === undefined) {
      return;
    }
    const subscription = this.movieService.getWinnersByYear(this.yearSearch).subscribe({
      next: (movies) => {
        this.winnersOfYear = movies;
      },
      error: (err) => {
        console.error('[DASHBOARD] Erro ao buscar vencedores:', err);
        this.error = `Erro ao buscar vencedores para o ano ${this.yearSearch}`;
      }
    });
    this.subscriptions.add(subscription);
  }
}