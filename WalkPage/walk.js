import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { Text, View, Image, TouchableHighlight } from 'react-native';
import coordinates from '../coordinates'; 
import { MapView , Location, Permissions } from 'expo';
import MapViewDirections from 'react-native-maps-directions';
import WaypointInfoBox from './waypoint'; 

class WalkMap extends React.Component {

    constructor(props) {

        super(props); 

        let coordinates = this.getWalkCoordinates();

        let markers = coordinates; 
        let origin = markers[0]; 

        this.state = { origin, markers }; 
        this.state.currentSegment = 0; //initialise at 0 

    }

    getWalkCoordinates() {

        let walkName = this.props.name; 
        let folderName = walkName.replace(' ','_').toLowerCase(); 

        return coordinates[folderName]; 
        
    }

    render() {

        let segmentOrigin = this.state.markers[this.state.currentSegment]; 
        let segmentDestination = this.state.markers[this.state.currentSegment+1]; 
        const DIRECTIONS_API_KEY = 'AIzaSyAAJJrT3CACnKvsMwLB8G60QrfQ_yxD-a8';

        let waypoint = {
            lat: segmentDestination.latitude,
            lng: segmentDestination.longitude
        }

        this.props.currentWaypoint({waypointNum:this.state.currentSegment+1,waypoint}); 

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

locationObservable = {}; 

class WalkPage extends React.Component {

    state = {
        myPositionMarker: [], //make array with single coordinate object so you can map over it in render function
        showButton: 0
    }

    componentWillMount() {

        this.getLocationAsync();
        
    }

    componentWillUnmount() {

        if(typeof locationObservable.remove !== 'undefined') {
            locationObservable.remove(); //prevent memory leaks
        }

    }

    getLocationAsync = async () => {

        let { status } = await Permissions.askAsync(Permissions.LOCATION);

        if (status === 'granted') {

            let { locationServicesEnabled } = await Location.getProviderStatusAsync(); 

            if(locationServicesEnabled) {

                let options = {
                    enableHighAccuracy: true,
                    timeInterval: 300, 
                    distanceInterval: 2
                }

                let callback = (obj) => {
            
                    let { longitude, latitude } = obj.coords; 

                    let myPositionMarker = [{ latitude, longitude }]; 

                    this.setState({myPositionMarker}); 

                    if(this.isWithinRadius({mylat:latitude,mylng:longitude})) {
                        console.log('show button'); 
                        this.setState({showButton:1})
                        
                    } 
                    else {
                        this.setState({showButton:0}); 
                    }
                }

                locationObservable = await Location.watchPositionAsync(options, callback); 
            
            }   
            else {
                alert('Please turn on location services');   
                this.props.navigation.pop(); 
            }
        }
        else {
            alert('Permission to access location was denied');     
        }
    }

    isWithinRadius({mylat,mylng}) {

        if(Math.abs(mylat - this.state.currentWaypointLat) <= 0.0008 && Math.abs(mylng - this.state.currentWaypointLng) <= 0.0008) {    
            return true; 
        }
        return false; 

    }

    getCurrentWaypoint = ({waypointNum, waypoint:{lat, lng}}) => {

        //save in state
        this.state = {
            currentWaypointNum:waypointNum,
            currentWaypointLat:lat,
            currentWaypointLng:lng
        }
    }

    render () {

        const { navigation } = this.props; 
        const walkName = navigation.getParam('walkName'); 

        return (
            <View style={{
                  flex: 1
                }}>
                <WalkMap name={walkName} 
                    position={this.state.myPositionMarker} 
                    currentWaypoint={this.getCurrentWaypoint}
                ></WalkMap>
                {this.state.showButton === 1 ? <WaypointInfoBox></WaypointInfoBox> : <View></View>}
            </View>
        )
    }
}

export default WalkPage; 
