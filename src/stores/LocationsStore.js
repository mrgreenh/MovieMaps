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
            error: false,
            shownInfoWindows: []
        };

        this.bindAction(AppActions.DISMISS_ERROR, this.onDismissError);
        this.bindActions(LocationsActions);
        this.registerAsync(LocationSources);
        this.exportPublicMethods({
            getLocationByString: this.getLocationByString,
            isInfoVisible: this.isInfoVisible
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

    onShowInfoWindow(locationId){
        if(this.state.shownInfoWindows.indexOf(locationId) == -1)
            this.state.shownInfoWindows.push(locationId);
    }

    onHideInfoWindow(locationId){
        var index = this.state.shownInfoWindows.indexOf(locationId);
        if(index>-1) this.state.shownInfoWindows.splice(index, 1);
    }

    //Geters

    getLocationByString(value){
        var id = this.state.locationsByString.get(value);
        if(id) return this.state.locations.get(id);
    }

    isInfoVisible(id){
        return this.state.shownInfoWindows.indexOf(id) > -1;
    }
}

export default alt.createStore(LocationsStore, 'LocationsStore');