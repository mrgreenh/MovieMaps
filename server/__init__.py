import os
from flask import Flask, render_template, make_response, request, jsonify
from db_utils import get_db
from entities.movies import Movie


app = Flask(__name__)

@app.route('/')
def index():
    #Want to use a different one locally
    GOOGLE_MAPS_KEY = os.environ.get('GOOGLE_MAPS_KEY')
    if not GOOGLE_MAPS_KEY:
        raise Exception("Missing google maps key")
    return render_template('index.html', google_maps_key=GOOGLE_MAPS_KEY)

@app.route('/movies/search')
def search_movies():
    keyword = request.args.get("keyword")
    dict_results = []
    if keyword is not None and len(keyword):
        keywords = keyword.split(" ")
        or_clause = []
        for keyword in keywords:
            or_clause.append({
                    "title": {"$regex": ".*"+keyword+".*", "$options": "i"}
                })
        query = { "$or": or_clause }
        results = Movie.find(query, limit=10)
        dict_results = [result.to_dict() for result in results]
    return jsonify(dict_results)