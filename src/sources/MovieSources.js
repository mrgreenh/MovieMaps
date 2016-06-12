import MoviesActions from '../actions/MoviesActions.js';
import axios from 'axios';

function find(state, page){
    return axios.get('/movies/search', {
        params: { keyword: state.searchTerm, page: page }
      }).then(res => res.data);
}

const MovieSources = {
    searchMovies: {
        remote: (state) => { return find(state, 0); },

        loading: MoviesActions.loading,
        success: MoviesActions.loadedSearchMatches,
        error: MoviesActions.loadingError
    },
    loadNewPage: {
        remote: (state) => { return find(state, state.queriedPage + 1); },

        shouldFetch: (state) => {
            if(state.autocompletion.length % 50 != 0)
                //Some page was not complete, no more data
                return false;
            else return true;

        },

        loading: MoviesActions.loading,
        success: MoviesActions.loadedNewPage,
        error: MoviesActions.loadingError
    }
}

export default MovieSources;