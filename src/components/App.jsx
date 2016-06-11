import React from 'react';
import {connect} from 'alt-react';
import AppStore from '../stores/AppStore.js';

class App extends React.Component{

    render(){
        return (
            <h1>{this.props.value}</h1>
        );
    }

}

export default connect(App, {
    listenTo() { return [AppStore]; },

    getProps(){
        return{
            value: AppStore.getState().test
        }
    }
});