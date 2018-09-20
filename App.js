import React from 'react';
import { createStackNavigator } from 'react-navigation';
import HomePage from './Home/home'; 
import WalkPage from './Walk/walk'; 

const RootStack = createStackNavigator(
    {
        Home: { screen: HomePage },
        Walk: { screen: WalkPage }
    },
    {
        initialRouteName: 'Home',
        headerMode: 'none'
    }
);

export default class App extends React.Component {
    render() {
        return <RootStack />;
  }
}





