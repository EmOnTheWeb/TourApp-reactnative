import React from 'react';
import { createStackNavigator } from 'react-navigation'; 
import { StyleSheet, Text, View, Image, TouchableHighlight, FlatList, Dimensions } from 'react-native';
import { homepageWalkData } from '../walkdata'; 


class HomePage extends React.Component {

	constructor(props) {
    	super(props);
    	navigator= this.props.navigation; 
  	}
  
    renderRow ({ item }) {
        return (
        <View style={styles.container}>
            <Text style={styles.titleText}>{item.name}</Text>
            <Image
	            source={item.image}
	            style={styles.image}
        	/>
            <Text style={styles.descriptionText}>{item.description}</Text>
	        <TouchableHighlight
	         	style={styles.button}
	         	onPress={() => navigator.navigate('Walk', {
                        walkName:item.name
                    })
                }
	        >
	         	<Text style={styles.text}>Start walk</Text>
	        </TouchableHighlight> 
        </View> )
    }

    render () {
        return (
           <View style={styles.container}> 
              <FlatList horizontal 
                data={homepageWalkData}
                renderItem={this.renderRow}
                keyExtractor={item => item.name}
                navigation={this.props.navigation}
              />
           </View>
        )
    }
}

const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        flexDirection:'column', 
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        width: Dimensions.get('window').width
    },
    image: {
        maxHeight:200
    }, 
    button: {
        alignItems: 'center',
        backgroundColor: '#b84c5c',
        padding: 10,
        margin:10,
        width:'95%',
        borderRadius:5,
        marginBottom:0
    },
    text: {
        fontSize:20,
        color:'#fff'
    },
    titleText: {
        fontSize:20,
        width:'95%',
        marginBottom:5, 
        borderColor:'#A99F96',
        borderWidth:4,
        borderRadius:5,
        borderTopWidth:0,
        borderRightWidth:0,
        borderLeftWidth:0,
        color:'black'
    },
    descriptionText: {
        fontSize:15,
        margin:10
    }
});

export default HomePage; 