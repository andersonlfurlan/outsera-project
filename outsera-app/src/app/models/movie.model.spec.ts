import { describe, it, expect } from 'vitest';
import { Movie, Page, YearMultipleWinner, StudioCount, ProducerInterval, MaxMinInterval } from './movie.model';

describe('Movie Models', () => {
  
  describe('Movie Interface', () => {
    it('should create a valid Movie object', () => {
      const movie: Movie = {
        id: 1,
        year: 1980,
        title: 'Test Movie',
        studios: ['Test Studio'],
        producers: ['Test Producer'],
        winner: true
      };

      expect(movie.id).toBe(1);
      expect(movie.year).toBe(1980);
      expect(movie.title).toBe('Test Movie');
      expect(movie.studios).toEqual(['Test Studio']);
      expect(movie.producers).toEqual(['Test Producer']);
      expect(movie.winner).toBe(true);
    });

    it('should handle multiple studios and producers', () => {
      const movie: Movie = {
        id: 2,
        year: 1981,
        title: 'Multi Studio Movie',
        studios: ['Studio A', 'Studio B'],
        producers: ['Producer A', 'Producer B', 'Producer C'],
        winner: false
      };

      expect(movie.studios.length).toBe(2);
      expect(movie.producers.length).toBe(3);
      expect(movie.winner).toBe(false);
    });
  });

  describe('Page Interface', () => {
    it('should create a valid Page object', () => {
      const movies: Movie[] = [
        {
          id: 1,
          year: 1980,
          title: 'Test Movie',
          studios: ['Studio'],
          producers: ['Producer'],
          winner: true
        }
      ];

      const page: Page<Movie> = {
        content: movies,
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

      expect(page.content).toEqual(movies);
      expect(page.totalPages).toBe(1);
      expect(page.totalElements).toBe(1);
      expect(page.first).toBe(true);
      expect(page.pageable.pageNumber).toBe(0);
    });

    it('should handle empty page', () => {
      const page: Page<Movie> = {
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

      expect(page.content).toEqual([]);
      expect(page.empty).toBe(true);
      expect(page.totalElements).toBe(0);
    });
  });

  describe('YearMultipleWinner Interface', () => {
    it('should create a valid YearMultipleWinner object', () => {
      const yearWinner: YearMultipleWinner = {
        year: 1986,
        winnerCount: 2
      };

      expect(yearWinner.year).toBe(1986);
      expect(yearWinner.winnerCount).toBe(2);
    });
  });

  describe('StudioCount Interface', () => {
    it('should create a valid StudioCount object', () => {
      const studioCount: StudioCount = {
        name: 'Columbia Pictures',
        winCount: 7
      };

      expect(studioCount.name).toBe('Columbia Pictures');
      expect(studioCount.winCount).toBe(7);
    });
  });

  describe('ProducerInterval Interface', () => {
    it('should create a valid ProducerInterval object', () => {
      const producerInterval: ProducerInterval = {
        producer: 'Joel Silver',
        interval: 1,
        previousWin: 1990,
        followingWin: 1991
      };

      expect(producerInterval.producer).toBe('Joel Silver');
      expect(producerInterval.interval).toBe(1);
      expect(producerInterval.previousWin).toBe(1990);
      expect(producerInterval.followingWin).toBe(1991);
    });
  });

  describe('MaxMinInterval Interface', () => {
    it('should create a valid MaxMinInterval object', () => {
      const minInterval: ProducerInterval = {
        producer: 'Joel Silver',
        interval: 1,
        previousWin: 1990,
        followingWin: 1991
      };

      const maxInterval: ProducerInterval = {
        producer: 'Matthew Vaughn',
        interval: 13,
        previousWin: 2004,
        followingWin: 2017
      };

      const maxMinInterval: MaxMinInterval = {
        min: [minInterval],
        max: [maxInterval]
      };

      expect(maxMinInterval.min).toEqual([minInterval]);
      expect(maxMinInterval.max).toEqual([maxInterval]);
      expect(maxMinInterval.min[0].interval).toBe(1);
      expect(maxMinInterval.max[0].interval).toBe(13);
    });

    it('should handle multiple entries in min and max arrays', () => {
      const intervals: MaxMinInterval = {
        min: [
          {
            producer: 'Producer A',
            interval: 1,
            previousWin: 1980,
            followingWin: 1981
          },
          {
            producer: 'Producer B',
            interval: 1,
            previousWin: 1985,
            followingWin: 1986
          }
        ],
        max: [
          {
            producer: 'Producer C',
            interval: 10,
            previousWin: 1980,
            followingWin: 1990
          }
        ]
      };

      expect(intervals.min.length).toBe(2);
      expect(intervals.max.length).toBe(1);
      expect(intervals.min[0].producer).toBe('Producer A');
      expect(intervals.min[1].producer).toBe('Producer B');
    });

    it('should handle empty arrays', () => {
      const emptyIntervals: MaxMinInterval = {
        min: [],
        max: []
      };

      expect(emptyIntervals.min).toEqual([]);
      expect(emptyIntervals.max).toEqual([]);
      expect(emptyIntervals.min.length).toBe(0);
      expect(emptyIntervals.max.length).toBe(0);
    });
  });

  describe('Type Safety', () => {
    it('should enforce correct types for Movie properties', () => {
      const movie: Movie = {
        id: 1,
        year: 1980,
        title: 'Test',
        studios: ['Studio'],
        producers: ['Producer'],
        winner: true
      };

      expect(typeof movie.id).toBe('number');
      expect(typeof movie.year).toBe('number');
      expect(typeof movie.title).toBe('string');
      expect(Array.isArray(movie.studios)).toBe(true);
      expect(Array.isArray(movie.producers)).toBe(true);
      expect(typeof movie.winner).toBe('boolean');
    });
  });
});