from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    assert client.get("/api/health").json() == {"status":"ok"}

def test_contact_validation():
    response = client.post("/api/contact", json={"name":"A","email":"invalid","subject":"Test","message":"court","website":""})
    assert response.status_code == 422
