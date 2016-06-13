import React from 'react';
import {List, ListItem} from 'material-ui/List';
import Toggle from 'material-ui/Toggle';
import Checkbox from 'material-ui/Checkbox';
import IconButton from 'material-ui/IconButton';
import ActionInfo from 'material-ui/svg-icons/action/info';
import {grey400} from 'material-ui/styles/colors';
import './MoviesList.scss';

/**
*List of movies on the left pane
*@class MoviesList
*/
const iconStyle = {
    height: 18,
    width: 28,
    verticalAlign: "middle"
}

class MoviesList extends React.Component{
    handleToggle(id){
        this.props.onToggle(id);
    }

    handleInfoClick(movieId){
        this.props.onInfoClick(movieId);
    }

    render(){
        return (<List ref={this.props.moviesListRef} className="component-movies-list">
            {this.props.listValues.map(value => {

                var infoButton =    <IconButton
                                    className="movie-info-button"
                                    onClick={this.handleInfoClick.bind(this, value._id)}>
                                        <ActionInfo color={grey400}/>
                                    </IconButton>

                var isCheckboxDisabled = !(value.locations && value.locations.length);
                var checkbox = <Checkbox 
                                disabled={isCheckboxDisabled}
                                checked={this.props.mappedMoviesIds.indexOf(value._id) > -1}
                                onCheck={this.handleToggle.bind(this, value._id)}/>;
                return <ListItem
                        className="movie-list-item"
                        key={value._id}
                        rightIconButton={infoButton}
                        leftCheckbox={checkbox}
                        secondaryText={"("+value.release_year+")"}>
                            {value.title}
                        </ListItem>
                })
            }
        </List>);
    }
}


export default MoviesList;