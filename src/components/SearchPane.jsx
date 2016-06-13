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
import Toggle from 'material-ui/Toggle'
import AvMovie from 'material-ui/svg-icons/av/movie';
import {redA200} from 'material-ui/styles/colors';

class SearchPane extends React.Component{

    componentDidMount(){
        this.props.searchMovies();
    }

    handleChange(e){
        this.props.searchMovies(e.target.value);
    }

    handleFilterChange(){
        this.props.toggleFilter();
    }

    handleScroll(e){
        var listRect = this.moviesList.getBoundingClientRect();
        var containerRect = e.currentTarget.getBoundingClientRect();
        var scrollToBottom = Math.abs(listRect.bottom - containerRect.height);
        if(listRect.bottom - containerRect.height < 200)
            this.props.loadNewPage();
    }

    render(){
        var selectedOnlyClassname = this.props.selectedOnly ? " showing-selected-only" : "";
        var textInputStyleOverride = {
            transition: "height 200ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, left .5s, opacity .5s"
        }

        return (<aside className="component-search-pane">
                    <div className="movies-list-container" onScroll={this.handleScroll.bind(this)}>
                        <MoviesList
                         moviesListRef={(c) => 
                            this.moviesList = ReactDOM.findDOMNode(c)}
                         listValues={this.props.listValues}
                         mappedMoviesIds={this.props.mappedMoviesIds}
                         onToggle={this.props.toggleMovie}
                         onInfoClick={this.props.showMovieInfo}/>
                    </div>
                    <header className={`movies-list-controls${selectedOnlyClassname}`}>
                        <AvMovie color={redA200} style={{width:30, height: 30}} className="title-icon"/><h1>MovieMaps</h1>
                        <TextField
                            fullWidth={true}
                            style={textInputStyleOverride}
                            className="text-search-input"
                            inputStyle={{marginTop:0}}
                            hintText="Search for movies here."
                            onChange={this.handleChange.bind(this)}/>
                        <Toggle
                            className="selected-only-toggle"
                            label="Show selected movies"
                            toggled={this.props.selectedOnly}
                            labelPosition="left"
                            onToggle={this.handleFilterChange.bind(this)}/>
                    </header>
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
            },
            showMovieInfo: MoviesActions.showMovieInfo,
            toggleFilter: MoviesActions.toggleFilter,
            selectedOnly: MoviesStore.state.selectedOnly
        }
    }
});