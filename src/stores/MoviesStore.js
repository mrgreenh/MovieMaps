import alt from '../alt.js';
import MoviesActions from '../actions/MoviesActions.js';
import AppActions from '../actions/AppActions.js';
import MovieSources from '../sources/MovieSources.js';
import LocationsStore from './LocationsStore.js';

class MoviesStore {
    constructor(){
        this.state = {
            loading: false,
            movies: new Map(),
            error: false,
            searchTerm: "",
            autocompletion: [],
            queriedPage: -1, //-1 means no page has been queried yet
            mappedMoviesIds: [],
            exploredMovieId: undefined,
            selectedOnly: false
        };

        this.bindAction(AppActions.DISMISS_ERROR, this.onDismissError);
        this.bindActions(MoviesActions);
        this.registerAsync(MovieSources);
        this.exportPublicMethods({
            getAutocompletionValues: this.getAutocompletionValues,
            getLocationMarkers: this.getLocationMarkers,
            getMovieInfo: this.getMovieInfo
        });
    }

    onLoading(){
        this.state.loading = true;
    }

    _updateAutocomplete(data){
        this.state.loading = false;
        for(var v of data){
            if(!this.state.movies.has(v._id))
                this.state.movies.set(v._id, v);
        }
        this.state.autocompletion = this.state.autocompletion.concat(data);
    }

    onLoadedNewPage(data){
        this.state.queriedPage += 1;
        this._updateAutocomplete(data);
    }

    onLoadedSearchMatches(data){
        this.state.autocompletion = [];
        this.state.queriedPage = 0;
        this._updateAutocomplete(data);
    }

    onLoadingError(){
        this.state.error = true;
    }

    onDismissError(){
        this.state.error = false;
    }

    onChangeSearchTerm(searchTerm){
        this.state.searchTerm = searchTerm;
    }

    onToggleMovie(id){
        var index = this.state.mappedMoviesIds.indexOf(id);
        if(index > -1) this.state.mappedMoviesIds.splice(index, 1);
        else this.state.mappedMoviesIds.push(id);
    }

    onShowMovieInfo(movieId){
        this.state.exploredMovieId = movieId;
    }

    onCloseMovieInfo(){
        this.state.exploredMovieId = undefined;
    }

    onToggleFilter(){
        this.state.selectedOnly = !this.state.selectedOnly;
    }

    //Getters

    getAutocompletionValues(){
        if(this.state.error)
            return [];
        else if(this.state.selectedOnly)
            return this.state.autocompletion.filter((v) => {
                return this.state.mappedMoviesIds.indexOf(v._id) > -1;
            }, this);
        else return this.state.autocompletion;
    }

    getLocationMarkers(){
        return this.state.mappedMoviesIds.reduce((result, movieId) => {
            var movieModel = this.state.movies.get(movieId);
            var locations = movieModel.locations || [];
            locations.forEach((l) => {
                var locationModel = LocationsStore.getLocationByString(l);
                if(locationModel)
                    result.set(locationModel._id, {
                        _id: locationModel._id,
                        position: {
                            lat: locationModel.lat,
                            lng: locationModel.lng
                        },
                        locationName: locationModel.search_string,
                        key: locationModel.search_string,
                        movieTitle: movieModel.title,
                        showInfo: LocationsStore.isInfoVisible(locationModel._id)
                    });
            })
            return result;
        }, new Map());
    }

    getMovieInfo(){
        var exploredMovieId = this.state.exploredMovieId;
        if(exploredMovieId) return this.state.movies.get(exploredMovieId);
    }

}

export default alt.createStore(MoviesStore, 'MoviesStore');