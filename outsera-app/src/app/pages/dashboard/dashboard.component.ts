import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieWinnersYearComponent } from '../../components/movie-winners-year/movie-winners-year.component';
import { YearsMultipleWinnersComponent } from '../../components/years-multiple-winners/years-multiple-winners.component';
import { TopStudiosComponent } from '../../components/top-studios/top-studios.component';
import { ProducerIntervalsComponent } from '../../components/producer-intervals/producer-intervals.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MovieWinnersYearComponent, YearsMultipleWinnersComponent, TopStudiosComponent, ProducerIntervalsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
}