import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, ImageBackground, Animated, TouchableOpacity } from 'react-native';
    
export default class Start extends Component {

    constructor(props) {
        super(props);
        this.opacity = new Animated.Value(0);
    }

    componentDidMount() {
        Animated.timing(this.opacity, {
            duration: 3000,
            toValue: 1,
            useNativeDriver: true
        }).start();
    }

    render() {
        return(
            <View style={styles.container}>
                <ImageBackground source={require('../assets/opening/dirty_earth.png')} resizeMode = "cover" style={styles.image}>
                    <Animated.View style={{
                        opacity: this.opacity
                    }}>
                        <Text style={styles.startText}>
                            Save the Earth
                        </Text>
                    </Animated.View>
                    <TouchableOpacity
                        style={styles.pressArea}
                        onPress={() => this.props.navigation.navigate('Home')}
                    />
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
        height: 250,
        width: 250,
        marginLeft: 'auto',
        marginRight: 'auto',
        backgroundColor: 'transparent',
        marginTop: 95,
        borderRadius: 250
    }
})