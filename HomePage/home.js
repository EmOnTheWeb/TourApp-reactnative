import React from 'react';
import { createStackNavigator } from 'react-navigation'; 
import { StyleSheet, Text, View, Image, TouchableHighlight, FlatList } from 'react-native';

const list = [
        {
            name: 'Central London',
            description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt',
            image: require('../assets/imgs/Central-London.png')    
        },
        {
            name: 'East London',
            description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt',
            image: require('../assets/imgs/Central-London.png')
        }
    ]; 

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
                data={list}
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
        flexWrap:'wrap'
    },
    image: {
      
    }, 
    button: {
        alignItems: 'center',
        backgroundColor: '#b84c5c',
        padding: 10,
        margin:10,
        width:'95%',
        borderRadius:5
    },
    text: {
        fontSize:20,
        color:'#fff'
    },
    titleText: {
        fontSize:20,
        fontWeight:'bold',
        margin:10,
        alignSelf:'flex-start'
    },
    descriptionText: {
        fontSize:15,
        margin:10
    }
});

export default HomePage; 