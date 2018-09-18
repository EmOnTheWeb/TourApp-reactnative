import React from 'react';
import { StyleSheet, Text, View, Image, TouchableHighlight, FlatList } from 'react-native';

export default class App extends React.Component {
  render() {
    return (
       <View style={styles.container}>
          <Text style={styles.titleText}>Central London</Text>
          <Image
            source={require('./imgs/Central-London.png')} 
            style={styles.image}
          />
        <TouchableHighlight
         style={styles.button}
        >
         <Text style={styles.text}>Start walk</Text>
        </TouchableHighlight> 
      </View>
    );
  }
}

class MyListItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.id);
  };

  render() {
    const textColor = this.props.selected ? "red" : "black";
    return (
       <View style={styles.container}>
          <Text style={styles.titleText}>Central London</Text>
          <Image
            source={require('./imgs/Central-London.png')} 
            style={styles.image}
          />
        <TouchableHighlight
         style={styles.button}
        >
         <Text style={styles.text}>Start walk</Text>
        </TouchableHighlight> 
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width:'95%',
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
  }
});
