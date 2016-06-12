import alt from '../alt.js';
import MoviesActions from '../actions/MoviesActions.js';
import AppActions from '../actions/AppActions.js';
import MovieSources from '../sources/MovieSources.js';

class MoviesStore {
    constructor(){
        this.state = {
            loading: false,
            movies: new Map(),
            error: false,
            autocompletion: []
        };

        this.bindAction(AppActions.DISMISS_ERROR, this.onDismissError);
        this.bindActions(MoviesActions);
        this.registerAsync(MovieSources);
    }

    onLoading(){
        this.state.loading = true;
    }

    onLoadedSearchMatches(data){
        this.state.loading = false;
        for(var v of data){
            this.state.movies.set(v._id, v);
        }
        this.state.autocompletion = data.map( m => m.title);
    }

    onLoadingError(){
        this.state.error = true;
    }

    onDismissError(){
        this.state.error = false;
    }

    onAddMovie(){
        
    }

}

export default alt.createStore(MoviesStore, 'AppStore');