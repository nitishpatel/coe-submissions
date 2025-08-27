from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"Hello": "World"}

def test_post_request():
    response = client.post("/movie/", json={"title": "Inception", "director": "Christopher Nolan"})
    assert response.status_code == 200
    assert response.json() == {"movie": {"title": "Inception", "director": "Christopher Nolan"}}

def test_put_request():
    response = client.put("/movie/1", json={"title": "Inception", "director": "Christopher Nolan"})
    assert response.status_code == 200
    assert response.json() == {"movie_id": 1, "movie": {"title": "Inception", "director": "Christopher Nolan"}}

def test_delete_request():
    response = client.delete("/movie/1")
    assert response.status_code == 200
    assert response.json() == {"message": "Movie with ID 1 deleted"}

def test_path_parameter():
    response = client.get("/movie/1/")
    assert response.status_code == 200
    assert response.json() == {"movie_id": 1, "title": "Inception", "director": "Christopher Nolan"}

def test_query_parameter():
    response = client.get("/movie/?director=ABCD")
    assert response.status_code == 200
    assert response.json() == {"movies": [{"id": 1, "title": "Inception", "director": "ABCD"}]}

def test_path_and_query_parameter():
    response = client.get("/get-movie/1/?director=ABCD")
    assert response.status_code == 200
    assert response.json() == {"movie_id": 1, "title": "Inception", "director": "ABCD"}

def test_pydantic_request_validation():
    response = client.post("/movie-validation/", json={"title": None, "director": None})
    assert response.status_code == 400
    assert response.json() == {"detail": [{"loc": ["body", "title"], "msg": "field required", "type": "value_error.missing"}, {"loc": ["body", "director"], "msg": "field required", "type": "value_error.missing"}]}