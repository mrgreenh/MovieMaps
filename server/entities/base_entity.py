from server.db_utils import get_db
from bson import ObjectId

#TODO pass this down to the frontend so that Constants.js doesn't have to be kept in sync
PAGE_SIZE = 20

class BaseEntity(object):

    def __init__(self, raw_data):
        self._id = raw_data.get("_id")

    def to_dict(self):
        """
        Simply makes sure _id is in the result.
        Should be extended by subclasses.
        """
        return {
            "_id": str(self._id)
        }

    @classmethod
    def find(klass, query, sort=None, sort_direction=1, page=0):
        """
        Runs query in klass.collection.
        Parameters:
            - query
            - sort
            - sort_direction (you can use the PyMongo constants)
            - page (Starts from 0. Pagination is based on PAGE_SIZE)
        """
        results = get_db()[klass.collection].find(query)

        if page is not None:
            results = results.skip(page*PAGE_SIZE).limit(PAGE_SIZE)
        if sort is not None:
            results = results.sort(sort, sort_direction)
        return [klass(result) for result in results]

    @classmethod
    def get(klass, id):
        """
        Gets a doc from klass.collection.
        Parameters:
            - id (String id, this will wrap it into a ObjectId)
        """
        result = get_db()[klass.collection].find_one({
                "_id": ObjectId(id)
            })
        if result is not None:
            result = klass(result)
        return result