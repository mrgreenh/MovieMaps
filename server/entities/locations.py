from server.entities.base_entity import BaseEntity
from server.entities.ingest_locations_data import ingest_locations_data

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

    @classmethod
    def ingest_locations_data(klass, *args, **kwargs):
        return ingest_locations_data(*args, **kwargs)