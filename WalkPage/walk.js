import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { Text, View, Image, TouchableHighlight } from 'react-native';
import { MapView , Location, Permissions } from 'expo';
import MapViewDirections from 'react-native-maps-directions';
import WaypointInfoBox from './waypoint'; 
import WalkMap from './walkmap'; 

locationObservable = {}; 

class WalkPage extends React.Component {

    state = {
        myPositionMarker: [], //make array with single coordinate object so you can map over it in render function
        showButton: 0,
        currentSegment:0
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
    }

    getTotalNumWaypoints = (numWaypoints) => {
   
        this.state.totalNumWaypoints = numWaypoints; 
     
    }

    directToNextWaypoint = () => {
     
        if(this.state.waypointDetails.currentWaypointNum === this.state.totalNumWaypoints) {
            console.log('this is the last waypoint')

        }
        else {
            this.setState(previousState =>  {
                return {currentSegment:previousState.currentSegment+1}
            });
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
                ></WalkMap>
                {this.state.showButton === 1 ? <WaypointInfoBox directToNextWaypoint={this.directToNextWaypoint}></WaypointInfoBox> : <View></View>}
            </View>
        )
    }
}

export default WalkPage; 
