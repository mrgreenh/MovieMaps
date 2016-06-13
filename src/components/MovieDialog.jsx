import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import {connect} from 'alt-react';
import MoviesStore from '../stores/MoviesStore.js';
import MoviesActions from '../actions/MoviesActions.js';
import './MovieDialog.scss';

/**
*The dialog showing the details for a movie
*@class MovieDialog
*/
class MovieDialog extends React.Component{

    getActors(){
        var actors = this.props.actors;
        if(actors && actors.length) return [
                "Starring ",
                <em>{actors.join(", ")}.</em>
            ];
    }

    getLocations(){
        var locations = this.props.locations;
        if(locations && locations.length) return [
                <p>Filmed in: </p>,
                <ul>
                    {locations.map((a) => <li key={a}>{a}</li>)}
                </ul>
            ];
        else return <p><em>No locations available for this movie.</em></p>;
    }    

    handleClose(){
        this.props.close();
    }

    render(){
        var actions = <RaisedButton
                            label="Thanks!"
                            primary={true}
                            keyboardFocused={true}
                            onMouseUp={this.handleClose.bind(this)}/>

        return <Dialog
                    className="component-movie-dialog"
                    actions={actions}
                    width={300}
                    modal={false}
                    open={!!this.props.title}
                    onRequestClose={this.handleClose.bind(this)}>
                        <h1>{this.props.title}</h1>
                        <p>Released in {this.props.release_year} by {this.props.production_company}.</p>
                        <p>{this.getActors()}</p>
                        {this.getLocations()}
                </Dialog>;
    }

}

export default connect(MovieDialog, {
    listenTo(){ return [MoviesStore]; },
    getProps(){
        var movieInfo = MoviesStore.getMovieInfo()
        return Object.assign({}, movieInfo, {
            close: MoviesActions.closeMovieInfo
        });
    }
});