from sets import Set
import requests
import logging
from server.db_utils import get_db


def ingest_movies_data(klass):
    """
    A movies-normalized collection will be built to store movies information.
    A normalized list of locations strings will be returned.
    """
    logging.info('Connecting to movies data source')
    #50000 is the max number of items retrievable at a time
    request = requests.get('https://data.sfgov.org/resource/wwmu-gmzc.json?$limit=50000')
    request_status_code = request.status_code
    if request_status_code == 200:
        result = request.json()
    else:
        raise Exception("Something didn't go 200 while fetching movies: "+request_status_code)

    normalized_movies = {}
    normalized_locations = Set()
    for location in result:
        location_title = location.get("title").strip().lower()

        if location_title not in normalized_movies:
            movie = klass(location)
        else:
            movie = klass(normalized_movies[location_title])
        #Need to update actors and locations in the normalized movie model
        movie.add_actors(location)
        movie.add_location(location)
        normalized_movies[location_title] = movie.to_dict()
        del normalized_movies[location_title]["_id"]

        if location.get("locations") is not None:
            normalized_locations.add(location["locations"])

    #Clean start for movies since we get the same collection every time
    #Since we don't need bookkeeping, better to write the whole thing in one shot
    #TODO add support for incremental changes if you want to support things like
    #user bookmarking and such
    db = get_db()
    db.movies.drop()
    insertResult = db.movies.insert_many(normalized_movies.values())

    return list(normalized_locations)
