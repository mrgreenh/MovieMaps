from sets import Set
import logging
from server.entities.base_entity import BaseEntity
from server.entities.ingest_movies_data import ingest_movies_data

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

    @classmethod
    def ingest_movies_data(klass):
        return ingest_movies_data(klass)