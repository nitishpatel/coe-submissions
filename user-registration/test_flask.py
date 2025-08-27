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


def test_item_name_validation(client):
    res = client.post("/items/", json={"name": "", "price": 10.0})
    assert res.status_code == 400
    assert res.json["validation_error"]["body_params"][0]["loc"] == ["name"]
    assert res.json["validation_error"]["body_params"][0]["msg"] == "String should have at least 1 character"
    assert res.json["validation_error"]["body_params"][0]["type"] == "string_too_short"

def test_min_max_length_name_validation(client):
    res = client.post("/items/", json={"name": "", "price": 10.0})
    assert res.status_code == 400
    assert res.json["validation_error"]["body_params"][0]["loc"] == ["name"]
    assert res.json["validation_error"]["body_params"][0]["msg"] == "String should have at least 1 character"
    assert res.json["validation_error"]["body_params"][0]["type"] == "string_too_short"

    res = client.post("/items/", json={"name": "LongEnough", "price": 10.0})
    assert res.status_code == 200
    assert res.json == {"name": "LongEnough", "price": 10.0}

    res = client.post("/items/", json={"name": "A" * 101, "price": 10.0})
    assert res.status_code == 400
    assert res.json["validation_error"]["body_params"][0]["loc"] == ["name"]
    assert res.json["validation_error"]["body_params"][0]["msg"] == "String should have at most 100 characters"
    assert res.json["validation_error"]["body_params"][0]["type"] == "string_too_long"