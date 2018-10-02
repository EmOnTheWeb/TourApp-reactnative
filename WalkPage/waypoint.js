import React from 'react';
import { StyleSheet, Text, View, Image, TouchableHighlight, LayoutAnimation, UIManager, Platform  } from 'react-native';
import waypointImgs from './waypoint_imgs'

class WaypointInfoBox extends React.Component {

    constructor() {
        super();
 
        if( Platform.OS === 'android' ) {
            UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
        }

        this.state = {
            waypointBoxHeight:0,
            showWaypointBox:0
        }
    }

    doWaypointStuff() {

        this.showImgAndControls(); 
        this.playWaypointAudio(); 
     
    }

    showImgAndControls() {

        const slideUpAnim = LayoutAnimation.create(100, 'easeInEaseOut', 'opacity'); 
        LayoutAnimation.configureNext(slideUpAnim);
        
        this.setState({waypointBoxHeight:320, showWaypointBox:1}); 

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

    renderWaypointBoxContents() {

          return <View style={{height: this.state.waypointBoxHeight, backgroundColor:'#fff', padding:10 }}>
                    <Text style={styles.waypointText}>{waypointImgs['central_london']['waypoint_1'].title}</Text>
                        <Image
                            source={waypointImgs['central_london']['waypoint_1'].src}
                        />
                </View>
    }

    renderPlayAudioButton() {

        if(this.state.showWaypointBox === 0) {

            return  <View style={styles.buttonContainer}>
                        <TouchableHighlight style={styles.button} 
                          onPress={() => {this.doWaypointStuff()}
                    }>
                        <Text style={styles.text}>Play audio</Text>
                        </TouchableHighlight>
                    </View>
        }
    }

    render () {
        return (
            <View>
               {this.renderPlayAudioButton()}
               {this.state.showWaypointBox === 1 ? this.renderWaypointBoxContents() : <View></View>}
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
    waypointText: {
        fontSize:20
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