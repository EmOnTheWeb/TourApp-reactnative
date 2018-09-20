import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { StyleSheet, Text, View, Image, TouchableHighlight, FlatList } from 'react-native';


class WalkPage extends React.Component {

    render () {
        return (
        	<View style={styles.container}>
	            <Text> 
	               Hello
	            </Text>
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