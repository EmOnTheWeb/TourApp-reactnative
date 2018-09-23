import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { StyleSheet, Text, View, Image, TouchableHighlight, FlatList } from 'react-native';
import coordinates from '../coordinates'; 
import MapView from 'react-native-maps';

class WalkMap extends React.Component {

    constructor(props) {

        super(props); 

        let coordinates = this.getWalkCoordinates();

        let origin = coordinates[0];  
        this.state = { origin }
        console.log(this.state.origin); 
    }

    getWalkCoordinates() {

        let walkName = this.props.name; 
        let folderName = walkName.replace(' ','_').toLowerCase(); 

        return coordinates[folderName]; 
        
    }

    render() {

        return (
            <View style={styles.container}><MapView style={styles.container} 
    initialRegion={{
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }}
  /><Text> 
                  hihi
                </Text></View>
        )
    }
}

class WalkPage extends React.Component {

    render () {

        const { navigation } = this.props; 
        const walkName = navigation.getParam('walkName'); 

        return (
        	<View style={styles.container}>
	            <Text> 
	               {walkName}
	            </Text>
                <WalkMap name={walkName}></WalkMap>
	        </View>

        )
    }
}

export default WalkPage; 

const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },   
    text: {
        fontSize:20
    }
});