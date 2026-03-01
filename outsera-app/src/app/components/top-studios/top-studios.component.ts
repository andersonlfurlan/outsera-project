import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { DashboardStore, DashboardState } from '../../stores';
import { StudioCount } from '../../models/movie.model';

@Component({
  selector: 'app-top-studios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-studios.component.html',
  styleUrl: './top-studios.component.css'
})
export class TopStudiosComponent implements OnInit {
  studiosWithWinCount$: Observable<StudioCount[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(private dashboardStore: DashboardStore, private cdr: ChangeDetectorRef) {
    this.studiosWithWinCount$ = this.dashboardStore.studiosWithWinCount$;
    this.loading$ = this.dashboardStore.loading$;
    this.error$ = this.dashboardStore.error$;
  }

  ngOnInit(): void {
    this.dashboardStore.loadStudiosWithWinCount();
  }
}