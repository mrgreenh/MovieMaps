import React from 'react';
import MoviesStore from '../stores/MoviesStore.js';
import AppActions from '../actions/AppActions.js';
import {connect} from 'alt-react';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';

/**
*This dialog will show up with showing an error message customized by store.
*@class StoresAlert
*/
class StoresAlert extends React.Component{

    handleClose(){
        AppActions.dismissError();
    }

    render(){

        var actions = [
            <RaisedButton
                label="Uh Oh... Ok."
                primary={true}
                onMouseUp={this.handleClose}/>
            ];

        return(
            <Dialog
              actions={actions}
              modal={false}
              open={this.props.open}
              onRequestClose={this.handleClose}>
              Sorryyyyyy, there has been a technical problem!
            </Dialog>
        );
    }
}

export default connect(StoresAlert, {
    listenTo() {
        return [MoviesStore];
    },

    getProps(){
        return{
            open: MoviesStore.state.error
        }
    }
});