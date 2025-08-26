import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Filter, Movie } from '../types';

type State = {
  movies: Movie[];
  filter: Filter;
  loading: boolean;
};

export const useMovieStore = create<State>()(
  persist<State>(
    (_set, _get): State => ({
      movies: [] as Movie[],
      filter: 'all' as Filter,
      loading: false,
    }),
    { name: 'movie-store' }
  )
);
