import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Filter, Movie } from '../types';

type State = {
  movies: Movie[];
  filter: Filter;
  loading: boolean;
};

type Actions = {
  addMovie: (title: string, note?: string) => void;
};

export const useMovieStore = create<State & Actions>()(
  persist<State & Actions>(
    (set, _get): State & Actions => ({
      movies: [],
      filter: 'all' as Filter,
      loading: false,

      addMovie: (title, note) => {
        const id = crypto.randomUUID();
        const createdAt = new Date().getTime();
        const watched = false;
        set((s) => ({
          movies: [
            { id: id, title: title, note: note, watched: watched, createdAt: createdAt },
            ...s.movies
          ]
        }))
      },
    }),
    { name: 'movie-store' }
  )
);
