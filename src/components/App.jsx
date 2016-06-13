import React from 'react';
import {connect} from 'alt-react';
import StoresAlert from './StoresAlert.js';
import './App.scss';
import Map from './Map.jsx';
import SearchPane from './SearchPane.jsx';
import MovieDialog from './MovieDialog.jsx';

/**
*The root component containing the rest of the application
*@class App
*/
class App extends React.Component{

    render(){
        return (
            <div className="component-app">
                <SearchPane />
                <Map />
                <MovieDialog />
                <StoresAlert />
            </div>
        );
    }

}

export default App;