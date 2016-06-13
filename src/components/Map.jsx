import React from 'react';
//TODO import from react-google-maps/lib/ComponentName to save in bundle size
import {GoogleMapLoader, GoogleMap, Marker, InfoWindow} from "react-google-maps";
import {connect} from "alt-react";
import MoviesStore from '../stores/MoviesStore';
import LocationsStore from '../stores/LocationsStore';
import LocationsActions from '../actions/LocationsActions.js';
import {getBoundingArea} from '../utils/GeographyUtils.js';
import './Map.scss';

//TODO shorten this file by pushing props to a module
class Map extends React.Component{

  handleCloseInfoWindow(locationId){
    this.props.hideInfoWindow(locationId);
  }

  getInfoWindow(markerData){
    var locationId = markerData._id;
    return <InfoWindow
              key={locationId}
              onCloseclick={this.handleCloseInfoWindow.bind(this, locationId)}>
              	<div>
		              <h3 style={{marginTop: 0, marginBottom: 10}}>
                    {markerData.locationName}
                  </h3>
		              This place appears in <strong>{markerData.movieTitle}</strong>.
	              </div>
            </InfoWindow>;
  }

  handleMarkerClick(locationId){
    this.props.showInfoWindow(locationId);
  }

  getMarkers(){
    var markersComponents = [];
    for(let data of this.props.markers.values()){
      var titleWords = data.movieTitle.split(" ");
      //Just a quick way to randomize the placeholder labels a bit
      //While still maintaining some resemblance with the movie title
      var label = {text: titleWords[72%titleWords.length]};

      markersComponents.push(
        <Marker
          {...data}
          label={label}
          onClick={this.handleMarkerClick.bind(this, data._id)}>
          {data.showInfo ? this.getInfoWindow(data) : null}
        </Marker>
        );
    }

    return markersComponents
  }

  getBounds(){
    var markers = this.props.markers;
    if(markers && markers.size > 1){
      var coordinatesList = [];
      markers.forEach((m) => {
        coordinatesList.push({
          lat: m.position.lat,
          lng: m.position.lng
        });
      });
      return getBoundingArea(coordinatesList);
    }
  }

  getCenter(){
    var markers = this.props.markers;
    if(markers && markers.size == 1){
      var marker = markers.values().next().value.position;
      return {lat: marker.lat, lng: marker.lng};
    }
  }

  componentDidUpdate(){
    //The bounds property of the react component is not working
    if(this.mapElement && this.props.markers && this.props.markers.size > 1)
      this.mapElement.fitBounds(this.getBounds());
  }

  render(){
    return (
      <section className="component-map" style={{height: "100%"}}>
        <GoogleMapLoader
          containerElement={
            <div style={{height: "100%",}}></div>
          }
          googleMapElement={
            <GoogleMap
              ref={(map) => this.mapElement = map}
              defaultZoom={12}
              center={this.getCenter() || { lat: 37.7771755, lng: -122.4184106 }}>

              {this.getMarkers()}
            
            </GoogleMap>
          }/>
      </section>
      );

  }
}

export default connect(Map, {
  listenTo() { return [MoviesStore, LocationsStore]; },
  getProps() {
    return {
        markers: MoviesStore.getLocationMarkers(),
        hideInfoWindow: LocationsActions.hideInfoWindow,
        showInfoWindow: LocationsActions.showInfoWindow,
    }
  }

  });