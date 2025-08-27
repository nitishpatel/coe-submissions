from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/movie/")
def create_movie(movie: dict):
    return {"movie": movie}

@app.put("/movie/{movie_id}")
def update_movie(movie_id: int, movie: dict):
    return {"movie_id": movie_id, "movie": movie}

@app.delete("/movie/{movie_id}")
def delete_movie(movie_id: int):
    return {"message": f"Movie with ID {movie_id} deleted"}

# Path Parameters
@app.get("/movie/{movie_id}/")
def read_movie(movie_id: int):
    return {"movie_id": movie_id, "title": "Inception", "director": "Christopher Nolan"}

# Query Parameters
@app.get("/movie/")
def read_movies(director: str = None):
    if director:
        return {"movies": [{"id": 1, "title": "Inception", "director": director}]}
    return {"movies": [{"id": 1, "title": "Inception", "director": "Christopher Nolan"}]}

# Path and Query Parameters
@app.get("/get-movie/{movie_id}/")
def get_movie(movie_id: int, director: str = None):
    if director:
        return {"movie_id": movie_id, "title": "Inception", "director": director}
    return {"movie_id": movie_id, "title": "Inception", "director": "Christopher Nolan"}