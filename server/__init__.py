import json
import os
import pymongo
from flask import Flask, render_template, make_response, request, jsonify
from db_utils import get_db
from entities.movies import Movie
from entities.locations import Location


app = Flask(__name__)

@app.route('/')
def index():
    """
    Serves the page. Needs an env variable GOOGLE_MAPS_KEY to be configured.
    This way you can have one key accepting calls from localhost
    staying hidden on development.
    """
    #Want to use a different one locally
    GOOGLE_MAPS_KEY = os.environ.get('GOOGLE_MAPS_KEY')
    if not GOOGLE_MAPS_KEY:
        raise Exception("Missing google maps key")
    return render_template('index.html', google_maps_key=GOOGLE_MAPS_KEY)

@app.route('/movies/search')
def search_movies():
    """
    Search movies by keyword. Implements pagination.
    Parameters:
        - keyword
        - page
    """
    keyword = request.args.get("keyword")
    page_arg = request.args.get("page")
    page = int(page_arg) if page_arg else None
    query = {}
    if keyword is not None and len(keyword):
        keywords = keyword.split(" ")
        and_clause = []
        for keyword in keywords:
            and_clause.append({
                    "title": {"$regex": ".*"+keyword+".*", "$options": "i"}
                })
        query = { "$and": and_clause }
    results = Movie.find(query, page=page)
    dict_results = [result.to_dict() for result in results]
    return jsonify(dict_results)

@app.route('/movie/<movie_id>/locations/list')
def list_movie_locations(movie_id):
    """
    Given the movie id, returns its locations as they were resolved by google maps.
    Parameters:
        - movie_id
    """
    movie = Movie.get(movie_id)
    dict_results = []
    if movie and movie.locations and len(movie.locations):
        locations = movie.locations
        or_clause = []
        for location in locations:
            or_clause.append({
                    "search_string": location
                })
        query = { "$or": or_clause }
        results = Location.find(query)
        dict_results = [result.to_dict() for result in results]
    return jsonify(dict_results)