import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-top-studios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-studios.component.html',
  styleUrl: './top-studios.component.css'
})
export class TopStudiosComponent implements OnInit, OnDestroy {
  topStudios: { name: string; winCount: number }[] = [];
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

    const subscription = this.movieService.getStudiosWithWinCount().subscribe({
      next: (result) => {
        this.topStudios = result.studios.slice(0, 3);
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('[TOP-STUDIOS] Error loading data:', err);
        this.error = 'Error loading top studios';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
    this.subscriptions.add(subscription);
  }
}