import { FormEvent, useMemo, useState } from 'react';
import { useMovieStore } from './store/movieStore';
import './App.css';

type Filter = 'all' | 'pending' | 'watched';

export default function App() {
  // local UI state
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');

  // store selectors (fine-grained to avoid re-renders)
  const movies = useMovieStore((s) => s.movies);
  const filter = useMovieStore((s) => s.filter as Filter);
  const addMovie = useMovieStore((s) => s.addMovie);
  const toggleWatched = useMovieStore((s) => (s as any).toggleWatched as (id: string) => void);
  const deleteMovie = useMovieStore((s) => (s as any).deleteMovie as (id: string) => void);
  const setFilter = useMovieStore((s) => (s as any).setFilter as (f: string) => void);

  // derive filtered list
  const filtered = useMemo(() => {
    if (filter === 'watched') return movies.filter((m) => m.watched);
    if (filter === 'pending') return movies.filter((m) => !m.watched);
    return movies;
  }, [movies, filter]);

  const total = movies.length;
  const watchedCount = movies.filter((m) => m.watched).length;
  const pendingCount = total - watchedCount;

  function handleAdd(e: FormEvent) {
    e.preventDefault();
    addMovie?.(title, note);
    setTitle('');
    setNote('');
  }

  return (
    <div className="App">
      <header style={{ marginBottom: 24 }}>
        <h1>🎬 Movie Watchlist</h1>
        <p className="read-the-docs">Add movies, mark watched, filter, and clear watched ones.</p>
      </header>

      {/* Add form */}
      <form onSubmit={handleAdd} className="card" style={{ gap: 8 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Movie title"
          aria-label="Movie title"
        />
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional note (where to watch, format, etc.)"
          aria-label="Movie note"
        />
        <button type="submit">Add</button>
      </form>

      {/* Filters + counts */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <FilterButton current={filter} id="all" onClick={() => setFilter?.('all')} />
          <FilterButton current={filter} id="pending" onClick={() => setFilter?.('pending')} />
          <FilterButton current={filter} id="watched" onClick={() => setFilter?.('watched')} />
        </div>
        <div style={{ fontSize: 12, opacity: 0.8 }}>
          <strong>Total:</strong> {total} &nbsp;|&nbsp; <strong>Pending:</strong> {pendingCount} &nbsp;|&nbsp;{' '}
          <strong>Watched:</strong> {watchedCount}
        </div>
      </div>

      {/* List */}
      <ul style={{ listStyle: 'none', padding: 0, marginTop: 16, display: 'grid', gap: 8 }}>
        {filtered.length === 0 ? (
          <li className="card" style={{ textAlign: 'center', opacity: 0.7 }}>
            No movies yet. Add one!
          </li>
        ) : (
          filtered.map((m) => (
            <li key={m.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox"
                checked={m.watched}
                onChange={() => toggleWatched?.(m.id)}
                aria-label={`Toggle watched for ${m.title}`}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, textDecoration: m.watched ? 'line-through' : 'none' }}>{m.title}</div>
                {m.note && <div style={{ fontSize: 12, opacity: 0.8 }}>{m.note}</div>}
              </div>
              <button onClick={() => deleteMovie?.(m.id)} aria-label={`Delete ${m.title}`}>
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

function FilterButton({
  current,
  id,
  onClick,
}: {
  current: Filter;
  id: Filter;
  onClick: () => void;
}) {
  const active = current === id;
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '6px 10px',
        borderRadius: 6,
        border: '1px solid #8884',
        background: active ? '#646cff22' : 'transparent',
        fontWeight: active ? 700 : 400,
      }}
      aria-pressed={active}
    >
      {id[0].toUpperCase() + id.slice(1)}
    </button>
  );
}
