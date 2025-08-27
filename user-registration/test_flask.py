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