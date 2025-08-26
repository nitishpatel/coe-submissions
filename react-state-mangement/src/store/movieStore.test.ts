import { describe, it, beforeEach, expect } from 'vitest';
import { useMovieStore } from "./movieStore";

describe('movie store', () => {
  beforeEach(()=>{
    useMovieStore.setState({
      movies:[],
      filter:'all',
      loading:false
    })
  });

  it("init with an empty state",()=>{
    const movieState = useMovieStore.getState();
    expect(movieState.movies).toEqual([]);
    expect(movieState.filter).toBe("all");
    expect(movieState.loading).toBe(false);
  });

  it("can add a movie",()=>{
    const movieStore = useMovieStore.getState();
    movieStore.addMovie?.("ABCD","At Home");
    const {movies} = useMovieStore.getState();
    expect(movies.length).toBe(1);
    expect(movies[0].title).toBe("ABCD");
    expect(movies[0].note).toBe("At Home");
    expect(movies[0].watched).toBe(false);
  });

  it("should trim the movie names when adding",()=>{
    const movieStore = useMovieStore.getState();
    movieStore.addMovie?.("   ");
    movieStore.addMovie?.(" ABCD ");
    movieStore.addMovie?.("3 IDIOTS");
    const {movies} = useMovieStore.getState();
    expect(movies.length).toBe(2);
    expect(movies[0].name).toBe("ABCD");
  })
});