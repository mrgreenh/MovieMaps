import './main.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';

function render(){
    var container = document.querySelector("#app-container");
    ReactDOM.render(<App/>, container);
}

render();