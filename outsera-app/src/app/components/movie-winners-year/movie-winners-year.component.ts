import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-movie-winners-year',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './movie-winners-year.component.html',
  styleUrl: './movie-winners-year.component.css'
})
export class MovieWinnersYearComponent implements OnInit, OnDestroy {
  searchForm: FormGroup;
  winnersOfYear: Movie[] = [];
  loading: boolean = false;
  error: string | null = null;

  private subscriptions = new Subscription();

  constructor(
    private movieService: MovieService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.searchForm = this.formBuilder.group({
      yearSearch: [null, [Validators.required, Validators.min(1900), Validators.max(2030)]]
    });
  }

  ngOnInit(): void {
    console.log('[MOVIE-WINNERS-YEAR] Component initialized');
    console.log('[MOVIE-WINNERS-YEAR] Form status:', this.searchForm.status);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  searchYear(): void {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }

    const yearValue = Number(this.searchForm.get('yearSearch')?.value);
    
    if (!yearValue || isNaN(yearValue)) {
      return;
    }

    this.loading = true;
    this.error = null;
    this.cdr.markForCheck();

    const subscription = this.movieService.getWinnersByYear(yearValue).subscribe({
      next: (movies) => {
        this.winnersOfYear = movies;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('[MOVIE-WINNERS-YEAR] Error searching winners:', err);
        this.error = `No winners found for year ${yearValue}`;
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
    this.subscriptions.add(subscription);
  }

  get yearSearchControl() {
    return this.searchForm.get('yearSearch');
  }
}