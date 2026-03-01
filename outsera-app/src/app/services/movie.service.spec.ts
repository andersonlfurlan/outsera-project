import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MovieService } from './movie.service';
import { Movie, Page, YearMultipleWinner, StudioCount, MaxMinInterval } from '../models/movie.model';

describe('MovieService', () => {
  let service: MovieService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MovieService]
    });

    service = TestBed.inject(MovieService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get movies with pagination', () => {
    const mockPage: Page<Movie> = {
      content: [
        {
          id: 1,
          year: 1980,
          title: 'Test Movie',
          studios: ['Test Studio'],
          producers: ['Test Producer'],
          winner: true
        }
      ],
      totalPages: 1,
      totalElements: 1,
      first: true,
      last: true,
      number: 0,
      size: 10,
      numberOfElements: 1,
      empty: false,
      pageable: {
        pageNumber: 0,
        unpaged: false,
        paged: true,
        pageSize: 10,
        offset: 0
      },
      sort: {
        unsorted: true,
        sorted: false,
        empty: true
      }
    };

    service.getMovies(0, 10).subscribe(page => {
      expect(page).toEqual(mockPage);
      expect(page.content.length).toBe(1);
    });

    const req = httpTestingController.expectOne('/api/movies?page=0&size=10');
    expect(req.request.method).toBe('GET');
    req.flush(mockPage);
  });

  it('should get movies with winner filter', () => {
    const mockPage: Page<Movie> = {
      content: [],
      totalPages: 0,
      totalElements: 0,
      first: true,
      last: true,
      number: 0,
      size: 10,
      numberOfElements: 0,
      empty: true,
      pageable: {
        pageNumber: 0,
        unpaged: false,
        paged: true,
        pageSize: 10,
        offset: 0
      },
      sort: {
        unsorted: true,
        sorted: false,
        empty: true
      }
    };

    service.getMovies(0, 10, true).subscribe(page => {
      expect(page).toEqual(mockPage);
    });

    const req = httpTestingController.expectOne('/api/movies?page=0&size=10&winner=true');
    expect(req.request.method).toBe('GET');
    req.flush(mockPage);
  });

  it('should get movies by year', () => {
    const mockPage: Page<Movie> = {
      content: [],
      totalPages: 0,
      totalElements: 0,
      first: true,
      last: true,
      number: 0,
      size: 10,
      numberOfElements: 0,
      empty: true,
      pageable: {
        pageNumber: 0,
        unpaged: false,
        paged: true,
        pageSize: 10,
        offset: 0
      },
      sort: {
        unsorted: true,
        sorted: false,
        empty: true
      }
    };

    service.getMovies(0, 10, undefined, 1980).subscribe(page => {
      expect(page).toEqual(mockPage);
    });

    const req = httpTestingController.expectOne('/api/movies?page=0&size=10&year=1980');
    expect(req.request.method).toBe('GET');
    req.flush(mockPage);
  });

  it('should get movie by id', () => {
    const mockMovie: Movie = {
      id: 1,
      year: 1980,
      title: 'Test Movie',
      studios: ['Test Studio'],
      producers: ['Test Producer'],
      winner: true
    };

    service.getMovieById(1).subscribe(movie => {
      expect(movie).toEqual(mockMovie);
    });

    const req = httpTestingController.expectOne('/api/movies/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockMovie);
  });

  it('should get winners by year', () => {
    const mockMovies: Movie[] = [
      {
        id: 1,
        year: 1980,
        title: 'Test Movie',
        studios: ['Test Studio'],
        producers: ['Test Producer'],
        winner: true
      }
    ];

    service.getWinnersByYear(1980).subscribe(movies => {
      expect(movies).toEqual(mockMovies);
      expect(movies.length).toBe(1);
    });

    const req = httpTestingController.expectOne('/api/movies/winnersByYear?year=1980');
    expect(req.request.method).toBe('GET');
    req.flush(mockMovies);
  });

  it('should get years with multiple winners', () => {
    const mockData = {
      years: [
        { year: 1986, winnerCount: 2 },
        { year: 1990, winnerCount: 2 }
      ]
    };

    service.getYearsWithMultipleWinners().subscribe(data => {
      expect(data.years.length).toBe(2);
      expect(data.years[0].year).toBe(1986);
    });

    const req = httpTestingController.expectOne('/api/movies/yearsWithMultipleWinners');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should get studios with win count', () => {
    const mockData = {
      studios: [
        { name: 'Studio A', winCount: 5 },
        { name: 'Studio B', winCount: 3 }
      ]
    };

    service.getStudiosWithWinCount().subscribe(data => {
      expect(data.studios.length).toBe(2);
      expect(data.studios[0].name).toBe('Studio A');
    });

    const req = httpTestingController.expectOne('/api/movies/studiosWithWinCount');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should get producer intervals', () => {
    const mockData: MaxMinInterval = {
      min: [
        {
          producer: 'Producer A',
          interval: 1,
          previousWin: 1980,
          followingWin: 1981
        }
      ],
      max: [
        {
          producer: 'Producer B',
          interval: 10,
          previousWin: 1980,
          followingWin: 1990
        }
      ]
    };

    service.getMaxMinWinIntervalForProducers().subscribe(data => {
      expect(data.min.length).toBe(1);
      expect(data.max.length).toBe(1);
      expect(data.min[0].producer).toBe('Producer A');
    });

    const req = httpTestingController.expectOne('/api/movies/maxMinWinIntervalForProducers');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should get all movies', () => {
    const mockPage: Page<Movie> = {
      content: [],
      totalPages: 0,
      totalElements: 0,
      first: true,
      last: true,
      number: 0,
      size: 1000,
      numberOfElements: 0,
      empty: true,
      pageable: {
        pageNumber: 0,
        unpaged: false,
        paged: true,
        pageSize: 1000,
        offset: 0
      },
      sort: {
        unsorted: true,
        sorted: false,
        empty: true
      }
    };

    service.getAllMovies().subscribe(page => {
      expect(page).toEqual(mockPage);
    });

    const req = httpTestingController.expectOne('/api/movies?page=0&size=1000');
    expect(req.request.method).toBe('GET');
    req.flush(mockPage);
  });

  it('should get winners', () => {
    const mockPage: Page<Movie> = {
      content: [],
      totalPages: 0,
      totalElements: 0,
      first: true,
      last: true,
      number: 0,
      size: 1000,
      numberOfElements: 0,
      empty: true,
      pageable: {
        pageNumber: 0,
        unpaged: false,
        paged: true,
        pageSize: 1000,
        offset: 0
      },
      sort: {
        unsorted: true,
        sorted: false,
        empty: true
      }
    };

    service.getWinners().subscribe(page => {
      expect(page).toEqual(mockPage);
    });

    const req = httpTestingController.expectOne('/api/movies?page=0&size=1000&winner=true');
    expect(req.request.method).toBe('GET');
    req.flush(mockPage);
  });

  it('should get nominees', () => {
    const mockPage: Page<Movie> = {
      content: [],
      totalPages: 0,
      totalElements: 0,
      first: true,
      last: true,
      number: 0,
      size: 1000,
      numberOfElements: 0,
      empty: true,
      pageable: {
        pageNumber: 0,
        unpaged: false,
        paged: true,
        pageSize: 1000,
        offset: 0
      },
      sort: {
        unsorted: true,
        sorted: false,
        empty: true
      }
    };

    service.getNominees().subscribe(page => {
      expect(page).toEqual(mockPage);
    });

    const req = httpTestingController.expectOne('/api/movies?page=0&size=1000&winner=false');
    expect(req.request.method).toBe('GET');
    req.flush(mockPage);
  });
});
