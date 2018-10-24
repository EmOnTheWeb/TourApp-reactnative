import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { StyleSheet, Text, View, Image, TouchableHighlight } from 'react-native';
import { MapView } from 'expo';
import { coordinates } from '../walkdata'; 
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
        let machineName = walkName.replace(/ /g,'_').replace(/'/g,'').toLowerCase(); 

        return coordinates[machineName]; 
        
    }

    render() {

        let segmentOrigin = this.state.markers[this.props.currentSegment]; 
        let segmentDestination = this.state.markers[this.props.currentSegment+1]; 
        const DIRECTIONS_API_KEY = 'AIzaSyAAJJrT3CACnKvsMwLB8G60QrfQ_yxD-a8';

        let waypoint; let waypointNum; 
        
        if(this.props.isFirstWaypoint) {
            waypoint = {
                lat: segmentOrigin.latitude,
                lng: segmentOrigin.longitude
            }
            waypointNum = 0; 
        }
        else {
            waypoint = {
                lat: segmentDestination.latitude,
                lng: segmentDestination.longitude
            }

            waypointNum = this.props.currentSegment + 1; 
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

                    if(i===0) {
                        return (
                            <MapView.Marker
                                key={i}
                                coordinate={coordinates}
                                image={require('../assets/map_icons/Start_Flag.png')}
                            />
                        ); 
                    }
                    else if(i===this.state.markers.length -1) {
                        return (
                            <MapView.Marker
                                key={i}
                                coordinate={coordinates}
                                image={require('../assets/map_icons/Finish_Flag.png')}
                            />
                        ); 
                    }

                    else {
                        return (
                            <MapView.Marker
                                key={i}
                                coordinate={coordinates}
                            />
                        ); 
                    }
                })}

                {this.props.position.map((myPosition,i) => {  
                    return (
                        <MapView.Marker.Animated
                            key="myLocation"
                            ref={marker => { this.marker = marker }}
                            coordinate={myPosition}
                            style={{zIndex:2}}
                        >
                            <View style={styles.radius}> 
                                <View style={styles.marker} />
                            </View>
                        </MapView.Marker.Animated>
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

const styles = StyleSheet.create({
    radius: {
        height:50,
        width:50,
        borderRadius:50/2, 
        backgroundColor:'rgba(0,112,255,0.1)',
        borderWidth:1,
        borderColor:'rgba(0,112,255,0.3)',
        alignItems:'center',
        justifyContent:'center',
        overflow:'hidden'
    }, 
    marker: {
        height:20,
        width:20,
        borderWidth:3,
        borderColor:'white',
        borderRadius:20/2,
        backgroundColor:'#007AFF',
        overflow:'hidden'
    } 
});

export default WalkMap; 