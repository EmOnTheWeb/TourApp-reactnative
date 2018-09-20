import React from 'react';
import { createStackNavigator } from 'react-navigation';
import HomePage from './Home/home'; 
import { StyleSheet, Text, View, Image, TouchableHighlight, FlatList } from 'react-native';

export default createStackNavigator({
    Home: {
        screen: HomePage
    },
});






