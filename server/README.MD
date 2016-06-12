This script retrieves the entire movies database (size is quite small and not expected to grow quickly, as only so many movies can be shot in San Francisco every year).
It then completes the location information by cleaning up the data and submitting it to the google geocoding API.

A collection of movies and a collection of locations are created.

At last it normalizes this information by movie and stores it in MongoDB.

Google Geocoding API free usage limit: 2500 requests/day, 
Movies locations in database: 1241

Ingest script could be run once a week. It would incurr in a API usage limit when movies locations number grows. In that case it would be good to have the ingest script only obtain location informations incrementally. "Nice to have" for the current scope of the project.

- Add assumption that actors names by location are better organized by movie

- Add assumption that movies database does not grow too much too fast, better to digest upfront

-Add assumption collection will never grow beyond 50000

- mention text index added on movie titles. Mention how adding the same index on locations makes movies searchable by locations too.