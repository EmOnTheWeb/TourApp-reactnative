import React from 'react';
import { StyleSheet, Text, View, Image, TouchableHighlight, LayoutAnimation, UIManager, Platform  } from 'react-native';

class WaypointInfoBox extends React.Component {
    state = {
        waypointBoxHeight:0
    }

    doWaypointStuff() {

        this.showImgAndControls(); 
        this.playWaypointAudio(); 
     
    }

    showImgAndControls() {

        this.setState({waypointBoxHeight:500}); 

    }

    async playWaypointAudio() {

        const soundObject = new Expo.Audio.Sound();
        
        try {
          await soundObject.loadAsync(require('../assets/central_london/audio/waypoint_1.mp3'));
          await soundObject.playAsync();
          
        } catch (error) {
            console.log(error); 
        }
    }
    
    render () {
        return (
            <View>
                <View style={styles.buttonContainer}>
                    <TouchableHighlight style={styles.button} 
                          onPress={() => {this.doWaypointStuff()}
                    }>
                    <Text style={styles.text}>Play audio</Text>
                    </TouchableHighlight>
                </View>
                <View style={{height: this.state.waypointBoxHeight}}>
                       
                </View>
            </View>
        )
    }
  
}
export default WaypointInfoBox;

const styles = StyleSheet.create({
      
    text: {
        fontSize:20,
        color:'#fff'
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#b84c5c',
        padding: 10,
        margin:10,
        width:'95%',
        borderRadius:5
    },
    buttonContainer: {
        backgroundColor:'#fff', 
        position:'absolute',
        bottom:0,
        left:0,
        right:0
    }
});