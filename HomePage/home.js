import React from 'react';
import { createStackNavigator } from 'react-navigation'; 
import { StyleSheet, Text, TextInput, View, Image, TouchableHighlight, FlatList, Dimensions } from 'react-native';
import { homepageWalkData } from '../walkdata'; 


class HomePage extends React.Component {

	constructor(props) {
    	super(props);
    	navigator= this.props.navigation; 
  	}
  
    renderRow ({ item }) {
        return (
        <View style={styles.container}>
            <TextInput style={styles.titleText}
                       editable={false}
                       underlineColorAndroid="transparent">{item.name}
            </TextInput>
            <Image
	            source={item.image}
	            style={styles.image}
                resizeMode='cover'
        	/>
            <Text style={styles.descriptionText}>{item.description}</Text>
            <View style={styles.circleContainer}> 
                <View style={styles.circle}>
                    <Text style={styles.circleText}>{item.length}</Text>
                    <Text style={styles.circleMiniText}>miles</Text>
                </View>
                <View style={styles.circle}><Text style={styles.circleText}>{item.time}</Text></View> 
                <View style={styles.circle}>
                    <Text style={styles.circleText}>{item.waypoints}</Text>
                    <Text style={styles.circleMiniText}>audio</Text>
                </View> 
            </View> 
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
        borderRadius:5,
        borderBottomWidth:4,
        borderBottomColor:'#A99F96',
        color:'black'
    },
    descriptionText: {
        fontSize:15,
        margin:10
    },
    circle: {
        borderWidth: 4, 
        width: 76,
        height:76,
        borderColor:'#A99F96',
        borderRadius:38,
        alignItems:'center',
        justifyContent:'center' 
    },
    circleText: {
        fontSize:20, 
        fontWeight:'900'
    },
    circleMiniText: {
        fontSize:15,
        marginTop:-7 
    },
    circleContainer: {
        flexDirection:'row',
        justifyContent:'space-around', 
        width: Dimensions.get('window').width,
        marginBottom:5
    }
});

export default HomePage; 