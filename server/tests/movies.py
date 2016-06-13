from sets import Set
from copy import deepcopy
import unittest
from server.entities.movies import Movie
from server.tests.mock_data import MOCK_RAW_MOVIE_DATA, get_db_stub
import mock

class TestsMovieClass(unittest.TestCase):

    @mock.patch('server.entities.base_entity.get_db', side_effect=get_db_stub)
    def test_find_returns_first_movie_in_alphabetical_order(self, get_db_stub):
        m = Movie.find({})[0]
        self.assertEqual(m.title, "Alcatraz", "Wrong title: "+m.title)
        self.assertEqual(len(m.actors), 3, "Wrong actors count")
        self.assertEqual(len(m.locations), 6, "Wrong locations count")
        self.assertEqual("Leavenworth from Filbert & Francisco St" in m.locations, True)

    @mock.patch('server.entities.base_entity.get_db', side_effect=get_db_stub)
    def tests_find_returns_movie_according_to_query(self, get_db):
        result = Movie.find({"release_year": "2000"})
        self.assertEqual(len(result),1)
        self.assertEqual(result[0].title, "Boys and Girls")

    def test_creating_movie_normalizes_actors_correctly(self):
        mock_data = deepcopy(MOCK_RAW_MOVIE_DATA[0])
        del mock_data["actors"]

        m = Movie(mock_data)
        self.assertEqual(m.actors, Set())

        m.add_actors({
            "actor_1": "Actor1",
            "actor_2": "Actor2",
            "actor_3": "Actor3"
            })
        self.assertEqual(len(m.actors), 3)

        m.add_actors({
            "actor_1": "Actor4",
            "actor_2": "Actor2",
            "actor_3": "Actor5"
            })

        self.assertEqual(len(m.actors), 5) #And not 6

    def test_creating_movie_normalizes_locations_correctly(self):
        mock_data = deepcopy(MOCK_RAW_MOVIE_DATA[0])
        del mock_data["locations"]

        m = Movie(mock_data)
        self.assertEqual(m.locations, Set())

        m.add_location({}) #Doesn't crash
        m.add_location({
            "locations": "location1"
            })
        m.add_location({
            "locations": "location2"
            })
        self.assertEqual(len(m.locations), 2)

        m.add_location({
            "locations": "location1"
            })
        self.assertEqual(len(m.actors), 2) #And not 3