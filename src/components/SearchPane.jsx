import React from 'react';
import TextField from 'material-ui/TextField';
import {List} from 'material-ui/List'
import MoviesStore from '../stores/MoviesStore.js';
import LocationsStore from '../stores/LocationsStore.js';
import MoviesActions from '../actions/MoviesActions.js';
import {connect} from 'alt-react';
import debounce from 'lodash.debounce';
import './SearchPane.scss'
import ReactDOM from 'react-dom';
import MoviesList from './MoviesList.jsx';

class SearchPane extends React.Component{

    componentDidMount(){
        this.props.searchMovies();
    }

    handleChange(e){
        this.props.searchMovies(e.target.value);
    }

    handleScroll(e){
        var listRect = this.moviesList.getBoundingClientRect();
        var containerRect = e.currentTarget.getBoundingClientRect();
        var scrollToBottom = Math.abs(listRect.bottom - containerRect.height);
        if(listRect.bottom - containerRect.height < 100)
            this.props.loadNewPage();
    }

    render(){
        return (<aside className="component-search-pane">
                    <TextField
                        className="search-field"
                        hintText="E.g. Forrest"
                        floatingLabelText="Search for a movie!"
                        onChange={this.handleChange.bind(this)}/>
                    <List className="movies-list-container" onScroll={this.handleScroll.bind(this)}>
                        <MoviesList
                         moviesListRef={(c) => 
                            this.moviesList = ReactDOM.findDOMNode(c)}
                         listValues={this.props.listValues}
                         mappedMoviesIds={this.props.mappedMoviesIds}
                         onToggle={this.props.toggleMovie}/>
                    </List>
                </aside>);
    }

}

SearchPane.propTypes = {
    /**
    *List of movie objects populating the autocomplete.
    *@property listValues
    */
    listValues: React.PropTypes.array
}

export default connect(SearchPane, {
    listenTo() { return [MoviesStore]; },
    getProps(){
        return {
            listValues: MoviesStore.getAutocompletionValues(),
            mappedMoviesIds: MoviesStore.state.mappedMoviesIds,
            searchMovies: debounce((keyword) => {
                MoviesActions.changeSearchTerm(keyword);
                MoviesStore.searchMovies();
            }, 500),
            loadNewPage: debounce(MoviesStore.loadNewPage, 500),
            toggleMovie: (id) => {
                MoviesActions.toggleMovie(id);
                LocationsStore.listForMovie(id);
            }
        }
    }
});