import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { StyleSheet, Text, View, Image, TouchableHighlight, FlatList } from 'react-native';
import coordinates from '../coordinates'; 
import { MapView } from "expo";

class WalkMap extends React.Component {

    constructor(props) {

        super(props); 

        let coordinates = this.getWalkCoordinates();

        let origin = coordinates[0];  
        this.state = { origin }

    }

    getWalkCoordinates() {

        let walkName = this.props.name; 
        let folderName = walkName.replace(' ','_').toLowerCase(); 

        return coordinates[folderName]; 
        
    }

    render() {

        return (
            <MapView style={{
                  flex: 1
                }}
                initialRegion={{
                  latitude: this.state.origin.latitude,
                  longitude: this.state.origin.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421
                }}
            />
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