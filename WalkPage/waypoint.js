import React from 'react';
import { StyleSheet, Text, View, Image, TouchableHighlight, Button, LayoutAnimation, UIManager, Platform, Dimensions  } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

class WaypointInfoBox extends React.Component {

    soundObject; 

    constructor(props) {
        super();
 
        if( Platform.OS === 'android' ) {
            UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
        }

        let waypointNumber = props.currentWaypoint + 1; 

        this.state = {
            waypointBoxHeight:0,
            showWaypointBox:0, 
            audioPaused:0,
            audioFinished:0,
            waypointKey: 'waypoint_' + waypointNumber
        }
    }

    doWaypointStuff() {

        this.showImgAndControls(); 
        this.playWaypointAudio(); 
     
    }

    showImgAndControls() {

        const slideUpAnim = LayoutAnimation.create(100, 'easeInEaseOut', 'opacity'); 
        LayoutAnimation.configureNext(slideUpAnim);
        
        this.setState({waypointBoxHeight:Dimensions.get('window').width/2 + 35, showWaypointBox:1}); 

    }



    async playWaypointAudio() {

        this.soundObject = new Expo.Audio.Sound();

        try {
            await this.soundObject.loadAsync(this.props.waypointAudio[this.state.waypointKey]);
            await this.soundObject.playAsync();

            let onPlaybackStatusUpdate = (status) => {
             
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
            width: Dimensions.get('window').width,
            backgroundColor:'#fff', 
            position:'absolute',
            left:0,
            right:0,
            bottom:0,
            right:0,
            justifyContent:'center'
        }
    }

    takeMeToNextWaypoint() {
    
        this.props.directToNextWaypoint(); 
        this.setState({waypointBoxHeight:0, showWaypointBox:0}); 

    }

    renderDoneButton() {

        return  <TouchableHighlight style={styles.button} 
                    onPress={() => {this.takeMeToNextWaypoint()}}>
                    <Text style={styles.text}>Done</Text>
                </TouchableHighlight> 
    }

    renderWaypointBoxContents() {

        return <View style={this.waypointBoxStyles()}>
                <Text style={styles.waypointText}>{this.props.waypointData[this.state.waypointKey].title}</Text>
                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                    <Image
                        style={styles.thumbImg}
                        source={this.props.waypointData[this.state.waypointKey].img_src}
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
        paddingTop:3,
        borderTopWidth:0,
        marginLeft:2,
        paddingLeft:5,
        borderColor:'#A99F96',
        borderWidth:2,
        borderLeftWidth:0,
        borderRightWidth:0,
        color:'black',
        width:'96%' 
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
        height:Dimensions.get('window').width/2,
        width:Dimensions.get('window').width/2,
        margin:2,
        marginRight:0
    },
    audioControls: {
        padding:10,
        height:Dimensions.get('window').width/2,
        width:Dimensions.get('window').width/2,
        alignItems:'flex-start', 
        justifyContent:'center',
        flexDirection:'row', 
        flexWrap:'wrap' 
    }
});