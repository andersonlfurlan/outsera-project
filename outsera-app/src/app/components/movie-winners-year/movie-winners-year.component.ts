import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { DashboardStore, DashboardState } from '../../stores';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-movie-winners-year',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './movie-winners-year.component.html',
  styleUrl: './movie-winners-year.component.css'
})
export class MovieWinnersYearComponent implements OnInit {
  searchForm: FormGroup;
  
  movieWinnersByYear$: Observable<DashboardState['movieWinnersByYear']>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(
    private dashboardStore: DashboardStore,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.searchForm = this.formBuilder.group({
      yearSearch: [null, [Validators.required, Validators.min(1900), Validators.max(2030)]]
    });
    
    this.movieWinnersByYear$ = this.dashboardStore.movieWinnersByYear$;
    this.loading$ = this.dashboardStore.loading$;
    this.error$ = this.dashboardStore.error$;
  }

  ngOnInit(): void {
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

    this.dashboardStore.loadMovieWinnersByYear(yearValue);
  }

  get yearSearchControl() {
    return this.searchForm.get('yearSearch');
  }
}