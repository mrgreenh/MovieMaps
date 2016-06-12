from server.db_utils import get_db

class BaseEntity(object):

    def __init__(self, raw_data):
        self._id = raw_data.get("_id")

    def to_dict(self):
        return {
            "_id": str(self._id)
        }

    @classmethod
    def find(klass, query, limit=None):
        results = get_db()[klass.collection].find(query)

        if limit is not None:
            results = results.limit(limit)
        return [klass(result) for result in results]