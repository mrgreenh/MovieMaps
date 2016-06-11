import alt from '../alt.js';
import AppActions from '../actions/AppActions.js';

class AppStore {
    constructor(){
        this.state = {test:"testvalue"};

        this.bindActions(AppActions);
    }
}

export default alt.createStore(AppStore, 'AppStore');