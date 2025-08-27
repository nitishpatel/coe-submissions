from flask import Flask
from pydantic import BaseModel
from flask_pydantic import validate

app = Flask(__name__)

@app.route("/",methods=["GET"])
def read_root():
    return {"Hello": "World"}

class Item(BaseModel):
    name: str
    price: float

@app.route("/items/", methods=["POST"])
@validate()
def create_item(body: Item):
    return body

if __name__ == "__main__":
  app.run(debug=True, host="0.0.0.0", port=8000)