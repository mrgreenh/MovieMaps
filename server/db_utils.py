import os
from pymongo import MongoClient
import logging

def get_db():
    MONGO_URL = os.environ.get('MONGO_URL')
    if not MONGO_URL:
        MONGO_URL = "mongodb://localhost:27017/";

    DB_NAME = os.environ.get('DB_NAME')
    if not DB_NAME:
        DB_NAME = 'test'

    client = MongoClient(MONGO_URL)

    db = client[DB_NAME]

    return db