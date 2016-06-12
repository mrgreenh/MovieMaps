import alt from '../alt.js';
import LocationsActions from '../actions/LocationsActions.js';
import AppActions from '../actions/AppActions.js';
import LocationSources from '../sources/LocationSources.js';

class LocationsStore {
    constructor(){
        this.state = {
            loading: false,
            locations: new Map(),
            locationsByString: new Map(),
            error: false
        };

        this.bindAction(AppActions.DISMISS_ERROR, this.onDismissError);
        this.bindActions(LocationsActions);
        this.registerAsync(LocationSources);
        this.exportPublicMethods({
            getLocationByString: this.getLocationByString
        });
    }

    onLoading(){
        this.state.loading = true;
    }

    onLoadedLocations(data){
        this.state.loading = false;
        for(var v of data){
            this.state.locations.set(v._id, v);
            this.state.locationsByString.set(v.search_string, v._id);
        }        
    }

    onLoadingError(){
        this.state.error = true;
    }

    onDismissError(){
        this.state.error = false;
    }

    //Geters

    getLocationByString(value){
        var id = this.state.locationsByString.get(value);
        if(id) return this.state.locations.get(id);
    }
}

export default alt.createStore(LocationsStore, 'LocationsStore');