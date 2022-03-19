import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Recycling from './Recycling';
import Start from './Start';
import Home from './Home';
import GameOver from './GameOver';
import Quiz from './Quiz';

const Stack = createStackNavigator();

export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Start'>
          <Stack.Screen name="Start" component={Start} options={{headerShown: false}} />
          <Stack.Screen name="Home" component={Home} options={{headerShown: false}} />
          <Stack.Screen name="Recycling" component={Recycling} options={{headerShown: false, animationEnabled: false}} />
          <Stack.Screen name="GameOver" component={GameOver} options={{headerShown: false, animationEnabled: false}} />
          <Stack.Screen name="Quiz" component={Quiz} options={{headerShown: false}} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}