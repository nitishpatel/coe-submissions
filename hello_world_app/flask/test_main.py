import pytest
from main import app

@pytest.fixture()
def client():
    app.testing = True
    return app.test_client()

def test_hello(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.data.decode("utf-8") == "Hello Friend!"
