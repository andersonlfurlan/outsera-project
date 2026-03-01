export interface Movie {
  id: number;
  year: number;
  title: string;
  studios: string[];
  producers: string[];
  winner: boolean;
}

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  number: number;
  size: number;
  numberOfElements: number;
  empty: boolean;
  pageable: {
    pageNumber: number;
    unpaged: boolean;
    paged: boolean;
    pageSize: number;
    offset: number;
  };
  sort: {
    unsorted: boolean;
    sorted: boolean;
    empty: boolean;
  };
}

export interface YearMultipleWinner {
  year: number;
  winnerCount: number;
}

export interface StudioCount {
  name: string;
  winCount: number;
}

export interface ProducerInterval {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
}

export interface MaxMinInterval {
  min: ProducerInterval[];
  max: ProducerInterval[];
}
