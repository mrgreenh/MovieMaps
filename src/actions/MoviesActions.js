import alt from '../alt.js';

//Actions dispatched to stores.
//They could become more declarative (e.g. functions with function signatures)
//but the application is too small for that to be actually useful.
export default alt.generateActions(
        "loading",
        "loadedSearchMatches",
        "loadingError",
        "changeSearchTerm",
        "toggleMovie",
        "loadedNewPage"
        );