import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { StyleSheet, Text, View, Image, TouchableHighlight, FlatList } from 'react-native';
import coordinates from '../coordinates'; 
import { MapView } from 'expo';
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
                    
                <MapViewDirections
                    origin={segmentOrigin}
                    destination={segmentDestination}
                    apikey={DIRECTIONS_API_KEY}
                />
            </MapView> 
        );
    }
}

class WalkPage extends React.Component {

    render () {

        const { navigation } = this.props; 
        const walkName = navigation.getParam('walkName'); 

        return (
            <View style={{
                  flex: 1
                }}>
                <WalkMap name={walkName}></WalkMap>
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