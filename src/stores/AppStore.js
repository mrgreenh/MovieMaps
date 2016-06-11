import alt from '../alt.js';
import AppActions from '../actions/AppActions.js';
import AppSources from '../sources/AppSources.js';

class AppStore {
    constructor(){
        this.inputValue = "";

        this.bindActions(AppActions);
        this.registerAsync(AppSources);
    }

    onUpdateInputValue(newValue){
        this.inputValue = newValue;
    }

}

export default alt.createStore(AppStore, 'AppStore');