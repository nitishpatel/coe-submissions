import pytest
from flaskapp import app

@pytest.fixture
def client():
  app.testing = True
  return app.test_client()

def test_read_root(client):
  response = client.get("/")
  assert response.status_code == 200
  assert response.json == {"Hello": "World"}

def test_basic_pydantic_success_validation(client):
  response = client.post("/items/", json={"name": "Item", "price": 10.0})
  assert response.status_code == 200
  assert response.json == {"name": "Item", "price": 10.0}
