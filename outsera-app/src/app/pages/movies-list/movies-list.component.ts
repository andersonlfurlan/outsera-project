import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MovieService } from '../../services/movie.service';
import { Movie, Page } from '../../models/movie.model';

@Component({
  selector: 'app-movies-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './movies-list.component.html',
  styleUrl: './movies-list.component.css'
})
export class MoviesListComponent implements OnInit, OnDestroy {
  movies: Movie[] = [];
  totalElements: number = 0;
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  loading: boolean = false;
  error: string | null = null;

  filterWinner: boolean | null = null;
  filterYear: number | null = null;
  availableYears: number[] = [];

  private subscriptions = new Subscription();

  constructor(private movieService: MovieService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadMovies();
    this.loadAvailableYears();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadMovies(): void {
    this.loading = true;
    this.error = null;

    const subscription = this.movieService.getMovies(
      this.currentPage,
      this.pageSize,
      this.filterWinner !== null ? this.filterWinner : undefined,
      this.filterYear !== null ? this.filterYear : undefined
    ).subscribe({
      next: (data: Page<Movie>) => {
        this.movies = data.content;
        this.totalElements = data.totalElements;
        this.totalPages = data.totalPages;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('[MOVIES-LIST] loadMovies ERROR', error);
        this.error = 'Erro ao carregar filmes';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
    this.subscriptions.add(subscription);
  }

  private loadAvailableYears(): void {
    const subscription = this.movieService.getAllMovies().subscribe({
      next: (data: Page<Movie>) => {
        const years = new Set(data.content.map(m => m.year));
        this.availableYears = Array.from(years).sort((a, b) => b - a);
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Years error:', error);
      }
    });
    this.subscriptions.add(subscription);
  }

  onFilterChange(): void {
    this.currentPage = 0;
    this.loadMovies();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadMovies();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadMovies();
    }
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadMovies();
    }
  }

  clearFilters(): void {
    this.filterWinner = null;
    this.filterYear = null;
    this.currentPage = 0;
    this.loadMovies();
  }

  get hasNextPage(): boolean {
    return this.currentPage < this.totalPages - 1;
  }

  get hasPreviousPage(): boolean {
    return this.currentPage > 0;
  }

  get displayedPages(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    const halfWindow = Math.floor(maxPagesToShow / 2);
    
    let startPage = Math.max(0, this.currentPage - halfWindow);
    let endPage = Math.min(this.totalPages - 1, this.currentPage + halfWindow);
    
    if (endPage - startPage < maxPagesToShow - 1) {
      if (startPage === 0) {
        endPage = Math.min(this.totalPages - 1, endPage + (maxPagesToShow - 1 - (endPage - startPage)));
      } else {
        startPage = Math.max(0, startPage - (maxPagesToShow - 1 - (endPage - startPage)));
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }
}
