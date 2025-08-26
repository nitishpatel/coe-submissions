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
  toggleWatched:(id:string) => void;
  deleteMovie?: (id: string) => void;
  setFilter?: (filter: Filter) => void;
};
const validateFilter = (filter: Filter) => {
  const validFilters: Filter[] = ['all', 'watched', 'pending'];
  if (!validFilters.includes(filter)) {
    throw new Error("Invalid filter");
  }
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

      toggleWatched:(id) =>{
        const movie = _get().movies.find(m=>m.id===id);
        if(!movie) return;
        set((s) => ({
          movies: s.movies.map(m =>
            m.id === id ? { ...m, watched: !m.watched } : m
          )
        }))
      },
      deleteMovie: (id) => {
        set((s) => ({
          movies: s.movies.filter(m => m.id !== id)
        }))
      },
      setFilter: (filter) => {
        validateFilter(filter);
        set({ filter });
      }
    }),
    { name: 'movie-store' }
  )
);
