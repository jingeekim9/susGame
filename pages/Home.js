import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, ImageBackground, Animated, TouchableOpacity } from 'react-native';
    
export default class Home extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View style={styles.container}>
                <ImageBackground source={require('../assets/home/dirty_pile.png')} resizeMode = "cover" style={styles.image}>
                    <TouchableOpacity 
                        style={styles.pressArea}
                        onPress = {() => this.props.navigation.navigate('Recycling')}
                    >
                        <Text style={styles.title}>PRESS THE TRASH PILE TO START</Text>
                    </TouchableOpacity>
                </ImageBackground>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    image: {
        flex: 1
    },
    startText: {
        color: 'white',
        fontSize: 40,
        textAlign: 'center',
        marginTop: 150,
        fontWeight: 'bold'
    },
    pressArea: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        marginBottom: 300,
        fontSize: 20,
        fontWeight: 'bold'
    }
})