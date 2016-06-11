import os
from flask import Flask
from flask.ext.pymongo import PyMongo
from bson.json_util import dumps
from bson.objectid import ObjectId
from flask import make_response

MONGO_URL = os.environ.get('MONGO_URL')
if not MONGO_URL:
    MONGO_URL = "mongodb://localhost:27017/test";

app = Flask(__name__)

app.config['MONGO_URI'] = MONGO_URL
mongo = PyMongo(app)

@app.route('/')
def index():
    resp = make_response(dumps(mongo.db.test.find_one({"_id": ObjectId("575b7a586b04e2520a5c51fb")}).get("value")), 200)
    return resp