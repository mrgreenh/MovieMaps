import React from 'react';
import debounce from 'lodash.debounce';
import {connect} from 'alt-react';
import MoviesStore from '../stores/MoviesStore.js';
import MoviesActions from '../actions/MoviesActions.js';
import AutoComplete from 'material-ui/AutoComplete';
import StoresAlert from './StoresAlert.js';
import {GoogleMapLoader, GoogleMap, Marker} from "react-google-maps";

/**
*The root component containing the rest of the application
*@class App
*/
class App extends React.Component{

    render(){
        return (            
            <div className="component-app">
                <h1>MovieMaps</h1>
                <AutoComplete
                  hintText="E.g. Forrest"
                  dataSource={this.props.autocompletion}
                  onUpdateInput={this.props.searchMovies}
                  floatingLabelText="Search for a movie!"
                  fullWidth={true}
                  onNewRequest={this.props.addMovie}
                  filter={AutoComplete.noFilter}/>
                <section style={{height: "500px"}}>
                  <GoogleMapLoader
                    containerElement={
                      <div
                        style={{
                          height: "100%",
                        }}
                      ></div>
                    }
                    googleMapElement={
                      <GoogleMap
                        ref={(map) => console.log(map)}
                        defaultZoom={3}
                        defaultCenter={{ lat: -25.363882, lng: 131.044922 }}
                        onClick={function(){}}
                      >
                      </GoogleMap>
                    }/>
                </section>
                <StoresAlert />
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
    listenTo() { return [MoviesStore]; },
    getProps(){
        return {
            autocompletion: MoviesStore.getAutocompletionValues(),
            searchMovies: debounce(MoviesStore.searchMovies, 500),
            addMovie: MoviesActions.addMovie
        }
    }
});