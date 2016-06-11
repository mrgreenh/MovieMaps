import os
import logging
import requests
import time
from db_utils import get_db

LOCATION_STOP_WORDS = ["from", "to", "between", "and"]

def ingest_locations_data(locations, limit=None)
    '''
    Will retrieve location information from Google, save it as {search_string, geocoding}.
    The "geocoding" key contains the first of the results obtained from API.
    "search_string" is the string that matches the movie location.
    Unresolved locations will be dropped.
    Limit sets the maximum number of locations to lookup. Useful for testing without consuming quota.
    '''
    GOOGLE_API_KEY = os.environ.get('GOOGLE_API_KEY');
    if not GOOGLE_API_KEY:
        logging.warning("No API key available for addresses geocoding")
    else:
        if limit is None: limit = len(locations)
        i = 0
        db = get_db()
        while i < limit:
            location = locations[i]
            
            logging.info("Looking up "+location+" on db.")
            result = db.locations.find_one({"search_string": location})
            if result is None:
                clean_location = cleanup_location(location)
                payload = {
                    "address": clean_location,
                    "key": GOOGLE_API_KEY
                }
                address = "https://maps.googleapis.com/maps/api/geocode/json"
                result = requests.get(address, params=payload)

                #Store the first result on database
                if result.get("status") == "OK" and len(result.get("results", [])):
                    db.locations.insert_one({
                            "search_string": location,
                            "geocoding": result.get("results")[0]
                        })

                #Google limits API calls to 10 per second. Adding some padding just to be sure.
                time.sleep(0.11)

def cleanup_location(location):
    sep_char = "<!>"
    for word in LOCATION_STOP_WORDS:
        location = location.replace(word, sep_char)

    split_location = location.split(sep_char)

    if(len(split_location)>1:
        return " and ".join(split_location[0:2])
    else:
        return split_location[0]