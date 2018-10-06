import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { Text, View, Image, TouchableHighlight } from 'react-native';
import { MapView } from 'expo';
import coordinates from '../coordinates'; 
import MapViewDirections from 'react-native-maps-directions';

class WalkMap extends React.Component {

    constructor(props) {

        super(props); 

        let coordinates = this.getWalkCoordinates();

        let markers = coordinates; 
        let origin = markers[0]; 

        this.props.totalNumWaypoints(markers.length-1); 

        this.state = { origin, markers }; 

    }

    shouldComponentUpdate(nextProps, nextState) {

        if(typeof nextState.markers[nextProps.currentSegment+1] === 'undefined') {
            return false; 
        }
        else {
            return true; 
        }
    }


    getWalkCoordinates() {

        let walkName = this.props.name; 
        let folderName = walkName.replace(' ','_').toLowerCase(); 

        return coordinates[folderName]; 
        
    }

    render() {

        let segmentOrigin = this.state.markers[this.props.currentSegment]; 
        let segmentDestination = this.state.markers[this.props.currentSegment+1]; 
        const DIRECTIONS_API_KEY = 'AIzaSyAAJJrT3CACnKvsMwLB8G60QrfQ_yxD-a8';

        let waypoint = {
            lat: segmentDestination.latitude,
            lng: segmentDestination.longitude
        }

        this.props.returnWaypointDetails({waypointNum:this.props.currentSegment+1,waypoint}); 
      

        return (
            <MapView style={{
                  flex: 1
                }}
                initialRegion={{
                  latitude: this.state.origin.latitude,
                  longitude: this.state.origin.longitude,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.007
                }}
            > 
                {this.state.markers.map((marker,i) => {

                    const coordinates = {
                        latitude:marker.latitude,
                        longitude:marker.longitude
                    }
                    return (
                        <MapView.Marker
                            key={i}
                            coordinate={coordinates}
                        />
                    ); 
                })}

                {this.props.position.map((myPosition,i) => {  
                    return (
                        <MapView.Marker.Animated
                            key="myLocation"
                            ref={marker => { this.marker = marker }}
                            coordinate={myPosition}
                        />
                    ); 
                })} 
                <MapViewDirections
                    origin={segmentOrigin}
                    destination={segmentDestination}
                    apikey={DIRECTIONS_API_KEY}
                    mode="walking"
                    strokeWidth={3}
                    strokeColor="hotpink"
                />
            </MapView> 
        );
    }
}

export default WalkMap; 