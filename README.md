MovieMaps
==================================

This is my implementation of the **SF Movies** project with a **Full Stack** focus.
Project is hosted on [Heroku](http://moviemaps.heroku.com/).
App is tested on Chrome, Safari and Firefox latest versions and is intended for use on desktop. The stack in general can support older browsers down to IE9 with some small adaptations (e.g. css flexbox).

Backend
==================================
Data Ingest
----------------------------------
The provided database contains one entry per each movie-location combination. It is of contained size (1241 rows) and is not likely to grow fast (only so many movies can be shot in SF every year).

The data available is not ready for being visualized on a map, in fact locations are expressed in a variety of different ways and sometimes specify areas, some other times venues, some other times addresses. The Google geocoding API can provide the location information for the pins to place on a map, however it only allows for 2500 requests/day, and no more than 10 requests per seconds. In addition to that, some locations still wouldn't resolve (E.g. "Market st. between 2nd and Polk"), and for this reason the string goes through an euristics-based cleanup step before being submitted to the API. **This step caused 100% of the provided locations to resolve to something. However the result is not always correct**, but it could be improved by further developing the now very simple cleanup step.

In theory, this project could be implemented entirely in the frontend without having to rely on a backend at all. However features like autocompletion, that generally need to be fast, would rely on an external endpoint for fetching the autocompletion data, in addition to that the string matching details would be limited by the API, unless we wanted to fetch all the data upfront (at this size, it is still an option). On top of that, once a movie's data is retrieved, showing it on a map would require calling the geocoding API potentially multiple times to resolve each location's data. Therefore we can justify a full-stack architecture of this project, by not excluding the possibility that the data will grow a lot (maybe if we want to use a similar app for showing movie locations in the entire country?).

Because the source dataset is small and fairly static, I decided to implement an [ingest script](ingest_script.py) that could be run periodically that will fetch and store all the data needed in a local mongodb instance. Because the only big limit we have at this point is the Google API quota, which could accidentally be drained by a couple of runs of the script, that part of the ingest pipeline is implemented to update data incrementally. The script also accepts an optional argument, an integer that limits the number of movies for which to resolve locations information (useful for testing).

The script populates a `movies` and a `locations` collections. Locations contains the locations normalized by their original string, each stores a geocoding object obtained from the Google API and a "success" flag that can ease post-mortem analysis of failed address resolutions. The movies collection contains normalized data for each movie. Locations in each movie are stored with their original string, as that is what's used to normalize the locations in the first place and can therefore act as a primary key, and can save us some database calls thanks to denormalization. A unique index on this field of the database is recommended.

Server
---------------------
The [server](server/__init__.py) is implemented using Flask. I use this framework for very simple projects that are not going to have to support too complex API endpoints/database relations. I tried to structure the API as if it was intended to grow into a REST API, however only two endpoints were needed and not even the most RESTful (search, list).

Entities (Movie, Location) inherit from a BaseEntity class that also implements the database access methods (using PyMongo).

API keys and DB address change on different environments according to environment variables.

Frontend
====================
The frontend code is compiled with webpack from ES6, JSX and SCSS. The sources are in the ./src folder and the result is in ./server/static/bundle.js. Ideally, the compiling would happen on deployment and Webpack would be able to read a `NODE_ENV` variable in order to enable/disable uglification and whether using the development or production version of React. Right now the build is intended to be for production but there are a couple lines that should be commented out for development.

The code follows the Flux pattern. In this project I decided to use [Alt.js](http://alt.js.org/) because it removes most of the boilerplate usually needed for writing flux applications and it's the most coincise I have tried so far. Also it provides some really nice utilities for handling async calls, so that it makes it convenient to implement error handling and loading state in the stores. Stores fetch data via Sources, that in turn update stores via Actions. Models received from the server are parsed in both stores into a javascript Map {id: model} (the locations store also stores {string: model} for quick lookup).

For the UI I wrote some custom (mostly higher order) components and then relied on the Material UI React library for most of the reusable components. Also the map uses the 'react-google-maps' npm package. Higher order components connect to stores via alt's connect, thus making it easier to refactor them into agnostic components should it become necessary. There hasn't been the chance to use a container component.

Each component with styling imports its own scss file. Every component importing a scss file sets by convention a class on its root element `component-*`, that is the class used at the root of its scss file. Scss files follow the same name as their components.

Locations and movies are chached locally. When a movie's locations are requested, they are not fetched again if they are already present in the Locations store.

Scaling
===================
Backend
----------------------
The movies part of the ingest script should also be written as incremental, so the source API is only queried for movies added/updated since the last fetch.

Frontend
---------------------
**The UI is already implementing the movies list with infinite scrolling**, thus fetching only the movies the user is actually asking for. Every fetched movie is cached locally, but the autocomplete relies on the server so that there will never be the need to download all movies to the app for the app to work. Also locations are only requested when their movie is selected.

However, right now there is no shouldComponentUpdate method implemented on any react component.
For a project at a bigger scale, I would make sure to define all the application state as an immutable object, possibly using Immutable.js. This would also allow for components to implement a shouldComponentUpdate method just by shallowly comparing the props they receive, and this would save an enormous amount of useless rendering (rendering in this context refers to React's rendering of the virtual DOM, not the browser's rendering).

Also I would make sure that the state's "shape" and allowed structure is well formalized (pherhaps using Immutable's Records) and documented. Also, it is true these days that Redux is receiving most of the public's consensus as a flux implementation, which makes it worth considering. It can present some scaling challenges in terms of code organization but on the other hand it already supports a lot of nice libraries for memoization and state denormalization that come in handy when taking care of performance.

Also, I would implement the movies list with lazy rendering, to allow the user to scroll through thousands of movies without problem.

Testing
====================
Backend
--------------------
I have written some [tests](runtests.py) on the entities and some utility function using Unittest, Mock and MongoMock. It definitely needs more testing so to include the pipeline and the Flask endpoints.
Frontend
--------------------
I started setting up tests for the frontend but the [Javascript Fatigued](https://medium.com/@ericclemmons/javascript-fatigue-48d4011b6fc4) setup process needed started taking too much time for what it should be like in a weekend project and decided to move on. I do make a point of writing tests in the frontend, but because the setup of this project was slightly different from what I usually use I did not have any ready-to-use boilerplate. It is possible to see the tentative setup in a [separate branch](https://github.com/mrgreenh/MovieMaps/tree/tentative_frontend_test_setup).

However, what I would have used would have been Mocha, with Sinon for stubbing, mocking and async. I would have tested the React components with Enzyme, which makes the process a breeze.
I would have tested the main user interaction flows by evaluating the state of stores after executing each flow's subsequent steps (simply by dispatching actions).
Todos
====================
First of all there are a few //TODOs left here and there in the code, so I would go through those.
Definitely set up the tests in the frontend, and write some more tests in the backend too.
**The Material UI library turned out to have some bugs, that are still left in the app**. Especially the "i" button next to each movie title only works on double click in Safari, and the second click event propagates to the list element so that the movie also gets unwillingly selected. These components need replacement.

Add more ReactProps validations to the various components in the frontend in general and document them, like I started doing [here](https://github.com/mrgreenh/MovieMaps/blob/master/src/components/SearchPane.jsx#L75-L81). Also the stores and actions need more documentation. The documentation syntax used can be compiled into a searchable documentation website by using for example YUI's parser in Gulp.

Also, the components I wrote became too big. Most of them can be further split into smaller, agnostic components.

Improve the script for resolving addresses as right now it is getting some wrong. Make the movies ingest incremental too.

Improve the UX. For example the user has no clue why a checkbox in the movies list is greyed out (because there are no locations). Also the labelling of the map is definitely not the best and **a legend should be shown** in the movies list, next to the name of the movies showing up in the app.
