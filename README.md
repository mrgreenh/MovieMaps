This script retrieves the entire movies database (size is quite small and not expected to grow quickly, as only so many movies can be shot in San Francisco every year).
It then completes the location information by cleaning up the data and submitting it to the google geocoding API.

A collection of movies and a collection of locations are created.

At last it normalizes this information by movie and stores it in MongoDB.

Google Geocoding API free usage limit: 2500 requests/day, 
Movies locations in database: 1241

Ingest script could be run once a week. It would incur in a API usage limit when movies locations number grows. For this reason the part responsible of resolving geocoded locations is only ran incrementally.
