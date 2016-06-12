from sets import Set
import requests
import logging
from server.db_utils import get_db
from server.entities.base_entity import BaseEntity

class Movie(BaseEntity):
    """
    Class representing a movie.
    It accepts either data from our MongoDb collection or from the original data source.
    """
    collection = "movies"
    def __init__(self, raw_data):
        super(Movie, self).__init__(raw_data)
        raw_locations = raw_data.get("locations")
        self.locations = Set(raw_locations) if type(raw_locations) == list else Set()
        self.actors = Set(raw_data.get("actors"))

        #These follow the same schema found on the data source
        self.title = raw_data.get("title", None)
        self.writer = raw_data.get("writer", None)
        self.director = raw_data.get("director", None)
        self.production_company = raw_data.get("production_company", None)
        self.distributor = raw_data.get("distributor", None)
        self.release_year = raw_data.get("release_year", None)

    def add_location(self, raw_location_data):
        if "locations" in raw_location_data:
            self.locations.add(raw_location_data.get("locations"))


    def add_actors(self, raw_location_data):
        for k in ["actor_1", "actor_2", "actor_3"]:
            if k in raw_location_data:
                self.actors.add(raw_location_data.get(k))

    def to_dict(self):
        result = super(Movie, self).to_dict()
        result.update({
                    "locations": list(self.locations),
                    "actors": list(self.actors),
                    "title": self.title,
                    "writer": self.writer,
                    "director": self.director,
                    "production_company": self.production_company,
                    "distributor": self.distributor,
                    "release_year": self.release_year
                })
        return result

    @classmethod
    def find(klass, *args, **kwargs):
        kwargs["sort"] = "title"
        return super(Movie, klass).find(*args, **kwargs)
        
#TODO move out to other file
def ingest_movies_data():
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
        location_title = location.get("title")

        if location_title not in normalized_movies:
            movie = Movie(location)
        else:
            movie = Movie(normalized_movies[location_title])
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
