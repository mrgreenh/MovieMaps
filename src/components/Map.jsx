import React from 'react';
import {GoogleMapLoader, GoogleMap, Marker} from "react-google-maps";
import {connect} from "alt-react";
import MoviesStore from '../stores/MoviesStore';
import LocationsStore from '../stores/LocationsStore';

class Map extends React.Component{

  getMarkers(){
    var markersComponents = [];
    for(let data of this.props.markers.values()){
      markersComponents.push(<Marker
          {...data}
          onRightclick={() => alert(data.key)}/>);
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
              ref={(map) => console.log(map)}
              defaultZoom={12}
              defaultCenter={{ lat: 37.7771755, lng: -122.4184106 }}
              onClick={function(){}}>

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
        markers: MoviesStore.getLocationMarkers()
    }
  }

  });