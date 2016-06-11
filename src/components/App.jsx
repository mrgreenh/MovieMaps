import React from 'react';
import {connect} from 'alt-react';
import AppStore from '../stores/AppStore.js';
import AppActions from '../actions/AppActions.js';
import AutoComplete from 'material-ui/AutoComplete';

/**
*The root component containing the rest of the application
*@class App
*/
class App extends React.Component{

    onSearchChange(newValue){
        AppStore.searchMovies(newValue);
    }

    render(){
        return (            
            <div className="component-app">
                <h1>MovieMaps</h1>
                <AutoComplete
                  hintText="E.g. Killbill"
                  dataSource={["something", "something1", "something2", "something3", "something4", "something5", "something6"]}
                  onUpdateInput={this.onSearchChange}
                  floatingLabelText="Search for a movie!"
                  fullWidth={true}
                  filter={AutoComplete.noFilter}/>
            </div>
        );
    }

}
React.propTypes = {
    /**
    *Value populating the search box.
    *@property searchValue
    */
    searchValue: React.PropTypes.string,
    /**
    *List of {text, value} objects populating the autocomplete. When empty, autocomplete disappears.
    *@property searchValue
    */
    autocompleteValues: React.PropTypes.array
}

export default connect(App, {
    listenTo() { return [AppStore]; },

    getProps(){
        return{
            searchValue: AppStore.inputValue
        }
    }
});