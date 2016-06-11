import AppActions from '../actions/AppActions.js';

const AppSources = {
    searchMovies: {
        remote(){
            
        },

        loading: AppActions.loading,
        success: AppActions.loadedSearchMatches,
        error: AppActions.loadingError
    }
}

export default AppSources;