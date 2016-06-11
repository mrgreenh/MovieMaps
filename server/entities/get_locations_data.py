import os
import logging
import requests

def get_locations_data(locations, limit=None)
    '''
    Will retrieve location information from Google, save it and return it in a {string: id} dict.
    Unresolved locations will be dropped.
    Limit sets the maximum number of locations to lookup. Useful for testing without consuming quota.
    '''
    GOOGLE_API_KEY = os.environ.get('GOOGLE_API_KEY');
    if not GOOGLE_API_KEY:
        logging.warning("No API key available for addresses geocoding")
    else:
        import pdb
        pdb.set_trace()
        if limit is None: limit = len(locations)
        payload = {
            "address": "Market and Polk, San Francisco, California",
            "key": GOOGLE_API_KEY
        }
        address = "https://maps.googleapis.com/maps/api/geocode/json"
        result = requests.get(address, params=payload)
        print result.json()