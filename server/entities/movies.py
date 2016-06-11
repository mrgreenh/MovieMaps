import Set
import requests
import logging
from db_utils import get_db

def ingest_movies_data():
    '''
    A movies-normalized collection will be built to store movies information.
    A normalized list of locations strings will be returned.
    '''
    logging.info('Connecting to movies data source')
    request = requests.get('https://data.sfgov.org/resource/wwmu-gmzc.json?$limit=2000')
    if request.status_code == 200:
        result = request.json()
    else:
        raise Exception("Something didn't go 200 while fetching movies")

    normalized_movies = {}
    normalized_locations = Set()
    for location in result:
        normalized_movies[location["title"]] = location
        normalized_locations.add(location["locations"])

    #Clean start for movies since we get the same collection every time
    #TODO add support for incremental changes if you want to support things like
    #user bookmarking and such
    db = get_db()
    db.movies.drop()
    insertResult = db.movies.insert_many(movies.values())

    return list(normalized_locations)
