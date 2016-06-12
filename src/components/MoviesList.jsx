import React from 'react';
import {List, ListItem} from 'material-ui/List';
import Toggle from 'material-ui/Toggle';

class MoviesList extends React.Component{
    handleToggle(id){
        this.props.onToggle(id);
    }

    render(){
        return (<List ref={this.props.moviesListRef} className="movies-list">
                    {this.props.listValues.map(value => {
                        var toggle = <Toggle 
                                        toggled={this.props.mappedMoviesIds.indexOf(value._id) > -1}
                                        onToggle={this.handleToggle.bind(this, value._id)}/>;
                        
                        return <ListItem
                                key={value._id}
                                rightToggle={toggle}
                                secondaryText={"("+value.release_year+")"}>
                                    {value.title}
                                </ListItem>
                        })
                    }
                </List>);
    }
}


export default MoviesList;