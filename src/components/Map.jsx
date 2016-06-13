import React from 'react';
import {GoogleMapLoader, GoogleMap, Marker, InfoWindow} from "react-google-maps";
import {connect} from "alt-react";
import MoviesStore from '../stores/MoviesStore';
import LocationsStore from '../stores/LocationsStore';
import LocationsActions from '../actions/LocationsActions.js';

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
		              <h3>{markerData.locationName}</h3>
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
      markersComponents.push(
        <Marker
          {...data}
          onClick={this.handleMarkerClick.bind(this, data._id)}>
          {data.showInfo ? this.getInfoWindow(data) : null}
        </Marker>
        );
    }

    return markersComponents
  }



  render(){
    return (
      <section style={{height: "100%"}}>
        <GoogleMapLoader
          containerElement={
            <div
              style={{
                height: "100%",
              }}
            ></div>
          }
          googleMapElement={
            <GoogleMap
              defaultZoom={12}
              defaultCenter={{ lat: 37.7771755, lng: -122.4184106 }}>

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