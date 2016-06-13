import mongomock
from bson import ObjectId

MOCK_RAW_MOVIE_DATA = [{
    "release_year" : "2000",
    "title" : "Boys and Girls",
    "writer" : "The Drews",
    "locations" : [
        "Fisherman's Wharf",
        "St. Peter & Paul's Church (666 Filbert Street, Washington Square)",
        "Coit Tower",
        "Ferry Building",
        "Aquatic Park (Jefferson Street)",
        "Chinatown",
        "1122 Folsom Street",
        "City Hall",
        "Alcatraz Island",
        "628 Cole Street",
        "Lombard Street",
        "Golden Gate Bridge"
    ],
    "director" : "Robert Iscove",
    "production_company" : "Punch 21 Productions",
    "actors" : [
        "Freddie Prinze, Jr.",
        "Alyson Hannigan"
    ],
    "distributor" : "Dimension Films"
},{
    "release_year" : "2012",
    "title" : "Alcatraz",
    "writer" : "Steven Lilien",
    "locations" : [
        "Leavenworth from Filbert & Francisco St",
        "Francisco St from Larkin to Polk",
        "Filbert St. from Jones to Mason",
        "Chestnut St. from Larkin to Columbus",
        "Taylor St. from Broadway to Filbert",
        "Broadway from Mason to Taylor"
    ],
    "director" : "J.J. Abrams",
    "production_company" : "Bonanza Productions Inc.",
    "actors" : [
        "Elizabeth Sarnoff",
        "Bryan Wynbrandt",
        "Sarah Jones"
    ],
    "distributor" : "Warner Bros. Television"
}]

MOCK_RAW_LOCATION_DATA = [
{
    "search_string" : "5th and Beale Streets",
    "geocoding" : {
        "geometry" : {
            "location_type" : "GEOMETRIC_CENTER",
            "bounds" : {
                "northeast" : {
                    "lat" : 37.7924486,
                    "lng" : -122.3884776
                },
                "southwest" : {
                    "lat" : 37.7851346,
                    "lng" : -122.3974305
                }
            },
            "viewport" : {
                "northeast" : {
                    "lat" : 37.7924486,
                    "lng" : -122.3884776
                },
                "southwest" : {
                    "lat" : 37.7851346,
                    "lng" : -122.3974305
                }
            },
            "location" : {
                "lat" : 37.7887056,
                "lng" : -122.3927701
            }
        },
        "formatted_address" : "Beale St, San Francisco, CA 94105, USA",
        "place_id" : "ChIJI2FbJ3uAhYARaS0KIXAHj_g"
    },
    "success" : True
},
{
    "search_string" : "California & Davis St",
    "geocoding" : {
        "geometry" : {
            "location" : {
                "lat" : 37.7935225,
                "lng" : -122.3976275
            },
            "viewport" : {
                "northeast" : {
                    "lat" : 37.7948714802915,
                    "lng" : -122.3962785197085
                },
                "southwest" : {
                    "lat" : 37.7921735197085,
                    "lng" : -122.3989764802915
                }
            },
            "location_type" : "APPROXIMATE"
        },
        "formatted_address" : "California St & Davis St, San Francisco, CA 94111, USA",
        "place_id" : "EjZDYWxpZm9ybmlhIFN0ICYgRGF2aXMgU3QsIFNhbiBGcmFuY2lzY28sIENBIDk0MTExLCBVU0E"
    },
    "success" : True
}]


def get_db_stub():
    fake_db = mongomock.MongoClient().db
    fake_db.movies.insert([MOCK_RAW_MOVIE_DATA])
    fake_db.locations.insert([MOCK_RAW_LOCATION_DATA])
    return fake_db