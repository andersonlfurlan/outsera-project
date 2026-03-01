import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { DashboardStore, DashboardState } from '../../stores';

@Component({
  selector: 'app-producer-intervals',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './producer-intervals.component.html',
  styleUrl: './producer-intervals.component.css'
})
export class ProducerIntervalsComponent implements OnInit {
  producerIntervals$: Observable<DashboardState['producerIntervals']>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(private dashboardStore: DashboardStore, private cdr: ChangeDetectorRef) {
    this.producerIntervals$ = this.dashboardStore.producerIntervals$;
    this.loading$ = this.dashboardStore.loading$;
    this.error$ = this.dashboardStore.error$;
  }

  ngOnInit(): void {
    this.dashboardStore.loadProducerIntervals();
  }
}