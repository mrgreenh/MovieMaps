import React from 'react';
import MoviesStore from '../stores/MoviesStore.js';
import LocationsStore from '../stores/LocationsStore.js';
import AppActions from '../actions/AppActions.js';
import {connect} from 'alt-react';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import Snackbar from 'material-ui/Snackbar';

/**
*This dialogs and snackbars will show up when the stores have to say something to the user.
*E.g. loading or error!
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
            <div className="component-stores-alert">
                <Dialog
                  actions={actions}
                  modal={false}
                  width={200}
                  open={this.props.alert}
                  onRequestClose={this.handleClose}>
                  Sorryyyyyy, there has been a technical problem!
                </Dialog>
                <Snackbar
                  open={this.props.loading}
                  autoHideDuration={5000}
                  message="Loading..."/>
            </div>
        );
    }
}

export default connect(StoresAlert, {
    listenTo() {
        return [MoviesStore, LocationsStore];
    },

    getProps(){
        return{
            //Message can be easily made more specific by distinguishing between stores
            alert: MoviesStore.state.error || LocationsStore.state.error,
            loading: MoviesStore.state.loading || LocationsStore.state.loading
        }
    }
});