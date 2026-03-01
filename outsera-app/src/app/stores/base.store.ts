import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface BaseState {
  loading: boolean;
  error: string | null;
}

@Injectable()
export abstract class BaseStore<T extends BaseState> {
  protected state$: BehaviorSubject<T>;

  constructor(initialState: T) {
    this.state$ = new BehaviorSubject(initialState);
  }

  protected setState(partialState: Partial<T>): void {
    this.state$.next({
      ...this.state$.value,
      ...partialState
    });
  }

  protected getState(): T {
    return this.state$.value;
  }

  public select<K extends keyof T>(key: K): Observable<T[K]> {
    return new Observable(observer => {
      return this.state$.subscribe(state => {
        observer.next(state[key]);
      });
    });
  }

  public selectState(): Observable<T> {
    return this.state$.asObservable();
  }

  protected setLoading(loading: boolean): void {
    this.setState({ loading } as Partial<T>);
  }

  protected setError(error: string | null): void {
    this.setState({ error } as Partial<T>);
  }
}