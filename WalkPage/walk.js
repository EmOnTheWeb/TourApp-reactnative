import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { StyleSheet, Text, View, Image, TouchableHighlight, FlatList } from 'react-native';
import coordinates from '../coordinates'; 

class WalkMap extends React.Component {

    componentWillMount() {

        let walkName = this.props.name; 
        let folderName = walkName.replace(' ','_').toLowerCase(); 

        let walkCoordinates = coordinates[folderName]; 
        console.log(walkCoordinates); 
    }

    render() {

           

        return (
            <View></View>
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