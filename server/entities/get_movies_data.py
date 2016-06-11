import requests
import logging

def get_movies_data():
    '''
    A movies-normalized collection will be built to store movies information.
    Locations are stored as a list of mongo ids.
    '''
    logging.info('Connecting to movies data source')
    request = requests.get('https://data.sfgov.org/resource/wwmu-gmzc.json?$limit=2000')
    if request.status_code == 200:
        result = request.json()
    else:
        raise Exception("Something didn't go 200 while fetching movies")

    return normalized_movies, locations
