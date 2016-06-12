from server.db_utils import get_db
from bson import ObjectId

PAGE_SIZE = 50

class BaseEntity(object):

    def __init__(self, raw_data):
        self._id = raw_data.get("_id")

    def to_dict(self):
        return {
            "_id": str(self._id)
        }

    @classmethod
    def find(klass, query, sort=None, sort_direction=1, page=0):
        results = get_db()[klass.collection].find(query)

        if page is not None:
            results = results.skip(page*PAGE_SIZE).limit(PAGE_SIZE)
        if sort is not None:
            results = results.sort(sort, sort_direction)
        return [klass(result) for result in results]

    @classmethod
    def get(klass, id):
        result = get_db()[klass.collection].find_one({
                "_id": ObjectId(id)
            })
        if result is not None:
            result = klass(result)
        return result