import sys
import requests
import logging
import os
from server.db_utils import get_db
from server.entities.movies import ingest_movies_data
from server.entities.locations import ingest_locations_data

logging.basicConfig(level=logging.DEBUG)
logging.info('Starting ingest script')



logging.info('Overriding movies collection')
normalized_locations = ingest_movies_data()

limit = None
if len(sys.argv) > 1:
    limit = int(sys.argv[1])
    logging.info("Limiting address lookup to first "+str(limit)+" movies retrieved.")

logging.info('Executing addresses geocoding')
ingest_locations_data(normalized_locations, limit=limit)