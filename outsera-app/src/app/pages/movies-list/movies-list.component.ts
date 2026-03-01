import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Movie } from '../../models/movie.model';
import { MovieStore, MovieState, MovieFilters } from '../../stores';

@Component({
  selector: 'app-movies-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './movies-list.component.html',
  styleUrl: './movies-list.component.css'
})
export class MoviesListComponent implements OnInit {
  movies$: Observable<Movie[]>;
  totalElements$: Observable<number>;
  currentPage$: Observable<number>;
  pageSize$: Observable<number>;
  totalPages$: Observable<number>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  filters$: Observable<MovieFilters>;
  availableYears$: Observable<number[]>;

  filterWinner: boolean | null = null;
  filterYear: number | null = null;

  constructor(private movieStore: MovieStore, private cdr: ChangeDetectorRef) {
    this.movies$ = this.movieStore.movies$;
    this.totalElements$ = this.movieStore.totalElements$;
    this.currentPage$ = this.movieStore.currentPage$;
    this.pageSize$ = this.movieStore.pageSize$;
    this.totalPages$ = this.movieStore.totalPages$;
    this.loading$ = this.movieStore.loading$;
    this.error$ = this.movieStore.error$;
    this.filters$ = this.movieStore.filters$;
    this.availableYears$ = this.movieStore.availableYears$;
  }

  ngOnInit(): void {
    this.loadMovies();
    this.filters$.subscribe(filters => {
      this.filterWinner = filters.winner;
      this.filterYear = filters.year;
      this.cdr.markForCheck();
    });
  }

  loadMovies(): void {
    this.movieStore.loadMovies();
  }

  onFilterChange(): void {
    this.movieStore.setFilters({
      winner: this.filterWinner,
      year: this.filterYear
    });
  }

  nextPage(): void {
    this.movieStore.goToNextPage();
  }

  previousPage(): void {
    this.movieStore.goToPreviousPage();
  }

  goToPage(page: number): void {
    this.movieStore.setPage(page);
  }

  clearFilters(): void {
    this.movieStore.clearFilters();
  }
}
