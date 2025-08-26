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
  })
});