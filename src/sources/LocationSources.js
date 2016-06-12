import LocationsActions from '../actions/LocationsActions.js';
import MoviesStore from '../stores/MoviesStore.js';
import axios from 'axios';

function list(state, movieId){
    return axios.get('/movie/'+movieId+'/locations/list').then(res => res.data);
}

const LocationSources = {
    listForMovie: {
        remote: list,

        shouldFetch(state, movieId){
            var movieModel = MoviesStore.state.movies.get(movieId);
            if(!movieModel || !movieModel.locations) return false;
            var locations = movieModel.locations;
            for(var i in locations){
                if(!state.locations.has(locations[i]))
                    return true;
            }
            return false;
        },

        loading: LocationsActions.loading,
        success: LocationsActions.loadedLocations,
        error: LocationsActions.loadingError
    }
}

export default LocationSources;