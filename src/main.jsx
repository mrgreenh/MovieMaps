import './main.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

function render(){
    var container = document.querySelector("#app-container");
    ReactDOM.render(
        <MuiThemeProvider muiTheme={getMuiTheme()}>
            <App/>
        </MuiThemeProvider>
    , container);
}

render();