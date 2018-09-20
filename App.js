import React from 'react';
import { createStackNavigator } from 'react-navigation';
import HomePage from './Home/home'; 

const RootStack = createStackNavigator(
    {
        Home: HomePage
    },
    {
        initialRouteName:'Home',
        headerMode: 'none'
    }
);

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}





