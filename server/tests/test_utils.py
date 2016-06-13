import unittest
from server.entities.ingest_locations_data import cleanup_location

class TestsUtils(unittest.TestCase):

    def test_always_adds_san_francisco_cali(self):
        r = cleanup_location("Some Place")
        self.assertEqual(r, "Some Place, San Francisco, California", r)

    def test_turns_ranges_into_crossings(self):
        r = cleanup_location("Market St between 2nd and Polk")
        self.assertEqual(r, "Market St and 2nd, San Francisco, California", r)

        r = cleanup_location("Market St from 2nd to Polk")
        self.assertEqual(r, "Market St and 2nd, San Francisco, California", r)

    def test_turns_at_into_comma(self):
        r = cleanup_location("Some Place at Presidio")
        self.assertEqual(r, "Some Place, Presidio, San Francisco, California", r)