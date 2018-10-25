import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { StyleSheet, Text, View, Image, TouchableHighlight, Linking, Platform } from 'react-native';
import { MapView , Location, Permissions } from 'expo';
import MapViewDirections from 'react-native-maps-directions';
import WaypointInfoBox from './waypoint'; 
import WalkMap from './walkmap'; 
import { requireWaypointImgs, requireWaypointAudio } from './waypointdata'; 

locationObservable = {}; 

class WalkPage extends React.Component {

    state = {
        myPositionMarker: [], //make array with single coordinate object so you can map over it in render function
        showButton: 0,
        showNavigateToStartButton:0,
        currentSegment:0,
        isFirstWaypoint:true //flag to make sure u get origin of the first segment 
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
                    timeInterval: 200, 
                    distanceInterval: 1
                }

                let callback = (obj) => {
            
                    let { longitude, latitude } = obj.coords; 

                    let myPositionMarker = [{ latitude, longitude }]; 

                    this.setState({myPositionMarker}); 

                    if(this.isWithinRadius({mylat:latitude,mylng:longitude})) {
                        this.setState({showButton:1}); 
                        if(this.state.isFirstWaypoint) { this.setState({showNavigateToStartButton:0}); } 
                        
                    } 
                    else {

                        if(this.state.isFirstWaypoint) { this.setState({showNavigateToStartButton:1}); }
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
            console.log('this is the last waypoint'); 

        }
        else if(this.state.isFirstWaypoint) { //is first waypoint-origin of first segment don't update the directions segment (going to dest next)
            this.setState({isFirstWaypoint:false}); 
        }
        else {
            this.setState(previousState =>  {
                return {currentSegment:previousState.currentSegment+1}
            });
        }
        this.setState({showButton:0}); 
    }

    navigateToStart() {

        let latLngStr = this.state.waypointDetails.currentWaypointLat + ',' + this.state.waypointDetails.currentWaypointLng; 
        let url; 
        if( Platform.OS === 'android' ) {
            url = 'google.navigation:q=' + latLngStr;     
        } 
        else {
            url = 'http://maps.apple.com/?daddr=' + latLngStr;  
        }
        Linking.openURL(url); 
    }

    render () {

        const { navigation } = this.props; 
        const walkName = navigation.getParam('walkName'); 

        let machineName = walkName.replace(/ /g,'_').replace(/'/g,'').toLowerCase(); 

        // this.state.waypointAudioAssets = requireWaypointAudio(machineName); 
        this.state.waypointData = requireWaypointImgs(machineName); 

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
                {this.state.showButton === 1 ? <WaypointInfoBox directToNextWaypoint={this.directToNextWaypoint}
                                                currentWaypoint={this.state.waypointDetails.currentWaypointNum}
                                                waypointData={this.state.waypointData}
                                                walkName={machineName}></WaypointInfoBox> : <View></View>}
                {this.state.showNavigateToStartButton ===1 ? <TouchableHighlight style={styles.circleButton} onPress={()=> this.navigateToStart()}><Text style={styles.circleButtonText}>Go To Start</Text></TouchableHighlight> : <View></View> }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    circleButton: {
        width: 76,
        height:76,
        borderRadius:38, 
        backgroundColor:'#b84c5c',
        alignItems:'center',
        justifyContent:'center',
        position:'absolute',
        right:10,
        bottom:10
    },
    circleButtonText: {
        color:'white', 
        width:'70%', 
        fontSize:15,
        textAlign:'center'
    } 
});

export default WalkPage; 
