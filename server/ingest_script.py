import sys
import requests
import logging
import os
from db_utils import get_db
from entities.movies import ingest_movies_data
from entities.locations import ingest_locations_data

logging.basicConfig(level=logging.DEBUG)
logging.info('Starting ingest script')


limit = None
if len(sys.argv) > 1:
    limit = sys.argv[1]
    logging.info("Limiting address lookup to first "+str(limit)+" movies retrieved.")

logging.info('Overriding movies collection')
normalized_locations = ingest_movies_data()

logging.info('Executing addresses geocoding')
ingest_locations_data(normalized_locations, limit=limit)