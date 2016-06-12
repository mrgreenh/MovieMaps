import os
import logging
import requests
import time
from server.db_utils import get_db
from server.entities.base_entity import BaseEntity

class Location(BaseEntity):
    """
    Class representing a location.
    It accepts either data from our MongoDb collection or from the original data source.
    """
    collection = "locations"
    def __init__(self, raw_data):
        super(Location, self).__init__(raw_data)
        self.search_string = raw_data.get("search_string")
        self.geocoding = raw_data.get("geocoding")

    @property
    def lat(self):
        return self.geocoding.get("geometry", {}).get("location", {}).get("lat")

    @property
    def lng(self):
        return self.geocoding.get("geometry", {}).get("location", {}).get("lng")

    def to_dict(self):
        result = super(Location, self).to_dict()
        result.update({
                    "search_string": self.search_string,
                    "lat": self.lat,
                    "lng": self.lng
                })
        return result

    @classmethod
    def find(klass, *args, **kwargs):
        kwargs["sort"] = "title"
        return super(Location, klass).find(*args, **kwargs)

LOCATION_STOP_WORDS = ["from", "to", "between", "and"]

#TODO make locations class, sort code out to another file
def ingest_locations_data(locations, limit=None):
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
                    raise Exception("Something didn't go 200 while fetching movies: "+request_status_code)

                #Google limits API calls to 10 per second. Adding some padding just to be sure.
                logging.info("Waiting...")
                time.sleep(0.11)
            else:
                logging.info("Found, moving on...")

def cleanup_location(location):
    '''
    Location string cleanup... Based on "euristics"...
    '''

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