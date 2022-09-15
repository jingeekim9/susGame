import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, ImageBackground, Animated, TouchableOpacity } from 'react-native';
import * as Font from 'expo-font';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
    
export default class Start extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fontLoaded: false
        }
        this.opacity = new Animated.Value(0);
    }

    async componentDidMount() {
        await Font.loadAsync({
            // Load a font `Montserrat` from a static resource
            'GameFont': require('../assets/fonts/GameFont.otf'),
          });
        this.setState({fontLoaded: true})
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
                        {
                            this.state.fontLoaded &&
                            <Text style={[styles.startText, {fontFamily: 'GameFont'}]}>
                                Save the Earth
                            </Text>
                        }
                    </Animated.View>
                    <TouchableOpacity
                        style={styles.pressArea}
                        onPress={() => this.props.navigation.navigate('Home')}
                    />
                    <View style={{position: 'absolute', bottom: hp(5), justifyContent: 'center', width: '100%'}}>
                        <Text style={{color: 'white', fontWeight: 'bold', textAlign: 'center'}}>
                            Designed by Taehoon Lee
                        </Text>
                    </View>
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
        fontSize: hp(5),
        textAlign: 'center',
        marginTop: 150,
        fontWeight: 'bold',
        paddingBottom: 30
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