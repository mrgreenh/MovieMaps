from copy import deepcopy
import unittest
from server.entities.locations import Location
from server.tests.mock_data import MOCK_RAW_LOCATION_DATA, get_db_stub
import mock

class TestsLocationClass(unittest.TestCase):

    @mock.patch('server.entities.base_entity.get_db', side_effect=get_db_stub)
    def test_finds_location_correctly(self, get_db_stub):
        m = Location.find({"search_string": "California & Davis St"})[0]
        self.assertEqual(m.search_string, "California & Davis St", "Wrong location: "+m.search_string)

    @mock.patch('server.entities.base_entity.get_db', side_effect=get_db_stub)
    def test_extracts_coordinates(self, get_db_stub):
        m = Location.find({"search_string": "California & Davis St"})[0]
        self.assertEqual(m.lat, 37.7935225, "Wrong lat")
        self.assertEqual(m.lng, -122.3976275, "Wrong lng")