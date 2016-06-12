import MoviesActions from '../actions/MoviesActions.js';
import axios from 'axios';

const MoviesSources = {
    searchMovies: {
        remote(state, keyword){
            return axios.get('/movies/search', {
                params: { keyword: keyword }
              }).then(res => res.data);
        },

        loading: MoviesActions.loading,
        success: MoviesActions.loadedSearchMatches,
        error: MoviesActions.loadingError
    }
}

export default MoviesSources;