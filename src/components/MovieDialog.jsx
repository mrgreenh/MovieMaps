import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import {connect} from 'alt-react';
import MoviesStore from '../stores/MoviesStore.js';
import MoviesActions from '../actions/MoviesActions.js';


class MovieDialog extends React.Component{

    getActors(){
        var actors = this.props.actors;
        if(actors && actors.length) return [
                "starring ",
                ...actors.map((a) => <em>{a}</em>)
            ];
    }

    getLocations(){
        var locations = this.props.locations;
        if(locations && locations.length) return [
                "Filmed in: ",
                <ul>
                    {locations.map((a) => <li>{a}</li>)}
                </ul>
            ];
    }    

    render(){
        var actions = <RaisedButton
                            label="Thanks!"
                            primary={true}
                            keyboardFocused={true}
                            onMouseUp={this.props.close}/>

        return <Dialog
                  actions={actions}
                  style={{width: 200}}
                  open={!!this.props.title}
                  onRequestClose={this.props.close}>
                    <h1>{this.props.title}</h1>
                    <p>Released in {this.props.release_year} by {this.props.production_company}.</p>
                    <p>{this.getActors()}</p>
                    <p>{this.getLocations()}</p>
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