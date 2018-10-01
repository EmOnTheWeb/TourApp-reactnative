import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { StyleSheet, Text, View, Image, TouchableHighlight, FlatList } from 'react-native';
import coordinates from '../coordinates'; 
import { MapView , Location, Permissions } from 'expo';
import MapViewDirections from 'react-native-maps-directions';

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
        myPositionMarker: [] //make array with single coordinate object so you can map over it in render function
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
                    console.log(obj); 

                    let myPositionMarker = [{ latitude: obj.coords.latitude , longitude:obj.coords.longitude }]; 

                    this.setState({myPositionMarker});  
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


    render () {

        const { navigation } = this.props; 
        const walkName = navigation.getParam('walkName'); 

        return (
            <View style={{
                  flex: 1
                }}>
                <WalkMap name={walkName} position={this.state.myPositionMarker} ></WalkMap>
            </View>
        )
    }
}

export default WalkPage; 

const styles = StyleSheet.create({
      
    text: {
        fontSize:20
    }
});