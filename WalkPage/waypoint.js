import React from 'react';
import { StyleSheet, Text, View, Image, TouchableHighlight, Button, LayoutAnimation, UIManager, Platform  } from 'react-native';
import waypointImgs from './waypoint_imgs'
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

class WaypointInfoBox extends React.Component {

    soundObject; 

    constructor() {
        super();
 
        if( Platform.OS === 'android' ) {
            UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
        }

        this.state = {
            waypointBoxHeight:0,
            showWaypointBox:0, 
            audioPaused:0,
            audioFinished:0
        }
    }

    doWaypointStuff() {

        this.showImgAndControls(); 
        this.playWaypointAudio(); 
     
    }

    showImgAndControls() {

        const slideUpAnim = LayoutAnimation.create(100, 'easeInEaseOut', 'opacity'); 
        LayoutAnimation.configureNext(slideUpAnim);
        
        this.setState({waypointBoxHeight:213, showWaypointBox:1}); 

    }



    async playWaypointAudio() {

        this.soundObject = new Expo.Audio.Sound();
        
        try {
            await this.soundObject.loadAsync(require('../assets/central_london/audio/waypoint_1.mp3'));
            await this.soundObject.playAsync();

            let onPlaybackStatusUpdate = (status) => {
                console.log(status);
                if(status.didJustFinish) {
                    this.setState({audioFinished:1}); 
                } 
            }

            this.soundObject.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate); 
          
        } catch (error) {
            console.log(error); 
        }
    }

    waypointBoxStyles() {
        return {
            height: this.state.waypointBoxHeight, 
            backgroundColor:'#fff', 
            position:'absolute',
            left:0,
            right:0,
            bottom:0,
            justifyContent:'center'
        }
    }

    takeMeToNextWaypoint() {
        console.log('done'); 

    }

    renderDoneButton() {

        return  <TouchableHighlight style={styles.button} 
                    onPress={() => {this.takeMeToNextWaypoint()}}>
                    <Text style={styles.text}>Done</Text>
                </TouchableHighlight> 
    }

    renderWaypointBoxContents() {

        return <View style={this.waypointBoxStyles()}>
                <Text style={styles.waypointText}>{waypointImgs['central_london']['waypoint_1'].title}</Text>
                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                    <Image
                        style={styles.thumbImg}
                        source={waypointImgs['central_london']['waypoint_1'].src}
                        resizeMode='contain'
                    /> 
                    <View style={styles.audioControls}> 
                        <MaterialIcons name="replay" size={55} color="#b84c5c" onPress={()=>this.replayAudio()}/> 
                        {this.state.audioPaused === 0 && this.state.audioFinished ===0 ? <FontAwesome name="pause-circle-o" size={55} color="#b84c5c" onPress={()=>this.pauseAudio()} style={{marginLeft:20}} /> : <FontAwesome/> }
                        {this.state.audioPaused === 1 && this.state.audioFinished ===0 ? <FontAwesome name="play-circle-o" size={55} color="#b84c5c" onPress={()=>this.resumeAudio()} style={{marginLeft:20}} /> : <FontAwesome/> }
                        {this.state.audioFinished === 1 ?
                           this.renderDoneButton() : <View></View>}
                    </View>
                </View>  
            </View>
    }

    async replayAudio() {

        this.soundObject.replayAsync(); 

        if(this.state.audioFinished===1) {
            this.setState({audioFinished:0}); 
        }
    }

    async pauseAudio() {

        this.soundObject.pauseAsync(); 
        this.setState({audioPaused:1});  

    }

    async resumeAudio() {

        this.soundObject.playAsync(); 
        this.setState({audioPaused:0}); 
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
        color:'#fff',
    },
    waypointText: {
        fontSize:20,
        padding:5,
        backgroundColor:'lightgray'
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
    },
    thumbImg: {
        height:175,
        width:175,
        margin:2,
        marginRight:0
    },
    audioControls: {
        height:175,
        width:175,
        padding:10,
        alignItems:'flex-start', 
        justifyContent:'center',
        flexDirection:'row', 
        flexWrap:'wrap' 
    }
});