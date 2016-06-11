import requests
import logging
import os
from pymongo import MongoClient

logging.basicConfig(level=logging.DEBUG)
logging.info('Starting ingest script')

MONGO_URL = os.environ.get('MONGO_URL')
if not MONGO_URL:
    MONGO_URL = "mongodb://localhost:27017/";

DB_NAME = os.environ.get('DB_NAME')
if not DB_NAME:
    DB_NAME = 'test'

logging.info('Connecting to database')

client = MongoClient(MONGO_URL)

db = client[DB_NAME]

logging.info('Connecting to movies data source')
request = requests.get('https://data.sfgov.org/resource/wwmu-gmzc.json?$limit=2000')
if request.status_code == 200:
    result = request.json()
    db.movies.insert(result)
else:
    raise Exception("Something didn't go 200 while fetching movies")