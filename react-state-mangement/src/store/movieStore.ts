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
        const cleanedTitle = title.trim();
        if (!cleanedTitle) return;
        set((s) => ({
          movies: [
            ...s.movies,
            { id: id, title: cleanedTitle, note: note, watched: watched, createdAt: createdAt }
          ]
        }))
      },
    }),
    { name: 'movie-store' }
  )
);
