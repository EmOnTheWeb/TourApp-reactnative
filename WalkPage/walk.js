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

        this.props.totalNumWaypoints(markers.length-1); 

        this.state = { origin, markers, isFirstWaypoint:true }; 

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

        //for first segment both origin and destination are waypoints
        let waypoint; let waypointNum; 
        console.log(this.state.isFirstWaypoint); 
        if(this.state.isFirstWaypoint) {
            waypoint = {
                lat:segmentOrigin.latitude,
                lng:segmentOrigin.longitude
            }
            waypointNum = this.props.currentSegment; 
        }
        else {
            waypoint = {
                lat: segmentDestination.latitude,
                lng: segmentDestination.longitude
            }
            waypointNum = this.props.currentSegment+1; 
        }

        this.props.returnWaypointDetails({waypointNum, waypoint}); 
      

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
        showButton: 0,
        currentSegment:0,
        isFirstWaypoint:true,
        endOfWalk:0
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

        if(Math.abs(mylat - this.state.waypointDetails.currentWaypointLat) <= 0.0008 && Math.abs(mylng - this.state.waypointDetails.currentWaypointLng) <= 0.0008) {    
            return true; 
        }
        return false; 

    }

    getCurrentWaypointDetails = ({waypointNum, waypoint:{lat, lng}}) => {

        //save in state
        this.state.waypointDetails = {

            currentWaypointNum:waypointNum,
            currentWaypointLat:lat,
            currentWaypointLng:lng
        }
        console.log(this.state.waypointDetails); 
    }

    getTotalNumWaypoints = (numWaypoints) => {
   
        this.state.totalNumWaypoints = numWaypoints; 
     
    }

    directToNextWaypoint = () => {
     
        if(this.state.waypointDetails.currentWaypointNum === this.state.totalNumWaypoints) {
            //this is the last waypoint
            this.setState({endOfWalk:1});  
        }
        else if (this.state.waypointDetails.currentWaypointNum !==0) { 
            //if first waypoint don't draw new directions. both origin and dest. are waypoints
            this.setState(previousState =>  {
                return {currentSegment:previousState.currentSegment+1}
            });
        }
        else {
            //you've hit the first waypoint, now take the dest. of all segments in returnWaypointDetails
            this.setState({isFirstWaypoint:false}); 
        }
        this.setState({showButton:0});  
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
                    returnWaypointDetails={this.getCurrentWaypointDetails}
                    currentSegment={this.state.currentSegment}
                    totalNumWaypoints={this.getTotalNumWaypoints}
                    isFirstWaypoint={this.state.isFirstWaypoint}
                ></WalkMap>
                {this.state.showButton === 1 ? <WaypointInfoBox directToNextWaypoint={this.directToNextWaypoint}></WaypointInfoBox> : <View></View>}
            </View>
        )
    }
}

export default WalkPage; 
