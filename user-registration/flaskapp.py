from flask import Flask,jsonify
from pydantic import BaseModel, Field,ValidationError
from flask_pydantic import validate

app = Flask(__name__)


@app.route("/", methods=["GET"])
def read_root():
    return {"Hello": "World"}


class Item(BaseModel):
    name: str = Field(..., min_length=1,max_length=100)
    price: float = Field(..., gt=0)


@app.route("/items/", methods=["POST"])
@validate()
def create_item(body: Item):
    return body


@app.errorhandler(ValidationError)
def handle_pydantic_validation_error(exc: ValidationError):
    # Convert to FastAPI-like {"detail":[{loc, msg, type}]}
    detail = []
    for e in exc.errors():
        # prefix with "body" for parity
        loc = ["body"] + list(e.get("loc", []))
        detail.append({
            "loc": loc,
            "msg": e.get("msg", "Invalid value"),
            "type": e.get("type", "value_error"),
        })
    # Keep 400 to match flask-pydantic default, or switch to 422 if you prefer
    return jsonify({"detail": detail}), 400


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8000)
