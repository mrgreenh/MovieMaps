import os
import logging
import requests
import time
from server.db_utils import get_db

LOCATION_STOP_WORDS = ["from", "to", "between", "and"]

#TODO refactor to use the Location class as done in inges_movies_data
def ingest_locations_data(locations, limit=None):
    """
    Will retrieve location information from Google, save it as {search_string, geocoding}.
    The "geocoding" key contains the first of the results obtained from API.
    "search_string" is the string that matches the movie location.
    Unresolved locations will be dropped.
    Limit sets the maximum number of locations to lookup. Useful for testing without consuming quota.
    """
    GOOGLE_API_KEY = os.environ.get('GOOGLE_API_KEY');
    if not GOOGLE_API_KEY:
        logging.warning("No API key available for addresses geocoding")
    else:
        if limit is None: limit = len(locations)
        else: limit = min(limit, len(locations))
        i = 0
        db = get_db()
        for i in range(limit):
            location = locations[i]
            logging.info("Looking up "+location+" on db.")

            result = db.locations.find_one({"search_string": location, "success": True})
            if result is None:
                clean_location = cleanup_location(location)
                logging.info("Not found. Asking google for "+clean_location)
                payload = {
                    "address": clean_location,
                    "key": GOOGLE_API_KEY
                }
                address = "https://maps.googleapis.com/maps/api/geocode/json"
                request = requests.get(address, params=payload)
                request_status_code = request.status_code

                if request_status_code == 200:
                    #Store the first result on database
                    json_result = request.json()
                    if json_result.get("status") == "OK" and len(json_result.get("results", [])):
                        logging.info("Saving "+str(json_result))
                        db.locations.insert_one({
                                "search_string": location,
                                "geocoding": json_result.get("results")[0],
                                "success": True
                            })
                    else:
                        logging.info("No results returned, storing on DB as failed for post-mortem: "+str(json_result))
                        db.locations.insert_one({
                                "search_string": location,
                                "success": False
                            })
                else:
                    raise Exception("Something didn't go 200 while fetching locations: "+request_status_code)

                #Google limits API calls to 10 per second. Adding some padding just to be sure.
                logging.info("Waiting...")
                time.sleep(0.11)
            else:
                logging.info("Found, moving on...")

def cleanup_location(location):
    """
    Location string cleanup... Based on "euristics"...
    Parameters:
        - location (The string to clanup)
    """
    #TODO fix this as it's breaking legitimate addresses like "Some St. at Some Other St."
    location = location.replace(" at ", ", ")

    sep_char = "<!>"
    for word in LOCATION_STOP_WORDS:
        location = location.replace(" "+word+" ", sep_char)

    split_location = location.split(sep_char)

    if len(split_location)>1:
        location = " and ".join(split_location[0:2])
    else:
        location = split_location[0]

    location = location + ", San Francisco, California"

    return location