import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie, Page, YearMultipleWinner, StudioCount, MaxMinInterval, ProducerInterval } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private readonly API_URL = '/api/movies';

  constructor(private http: HttpClient) {}

  getMovies(page: number = 0, size: number = 10, winner?: boolean, year?: number): Observable<Page<Movie>> {
    let url = `${this.API_URL}?page=${page}&size=${size}`;
    
    if (winner !== undefined) {
      url += `&winner=${winner}`;
    }
    
    if (year !== undefined) {
      url += `&year=${year}`;
    }
    
    return this.http.get<Page<Movie>>(url);
  }

  getMovieById(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.API_URL}/${id}`);
  }

  getWinnersByYear(year: number): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.API_URL}/winnersByYear?year=${year}`);
  }

  getAllMovies(): Observable<Page<Movie>> {
    return this.getMovies(0, 1000);
  }

  getWinners(): Observable<Page<Movie>> {
    return this.getMovies(0, 1000, true);
  }

  getNominees(): Observable<Page<Movie>> {
    return this.getMovies(0, 1000, false);
  }

  getYearsWithMultipleWinners(): Observable<{ years: YearMultipleWinner[] }> {
    return this.http.get<{ years: YearMultipleWinner[] }>(`${this.API_URL}/yearsWithMultipleWinners`);
  }

  getStudiosWithWinCount(): Observable<{ studios: StudioCount[] }> {
    return this.http.get<{ studios: StudioCount[] }>(`${this.API_URL}/studiosWithWinCount`);
  }

  getMaxMinWinIntervalForProducers(): Observable<MaxMinInterval> {
    return this.http.get<MaxMinInterval>(`${this.API_URL}/maxMinWinIntervalForProducers`);
  }
}

