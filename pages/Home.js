import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, ImageBackground, Animated, TouchableOpacity, Pressable } from 'react-native';
import * as Font from 'expo-font';
import Modal from 'react-native-modal';
    
export default class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fontLoaded: false,
            showModal: false
        }
    }

    async componentDidMount() {
        await Font.loadAsync({
            // Load a font `Montserrat` from a static resource
            'GameFont': require('../assets/fonts/GameFont.otf'),
          });
        this.setState({fontLoaded: true})
    }

    render() {
        return(
            <View style={styles.container}>
                <ImageBackground source={require('../assets/home/dirty_pile.png')} resizeMode = "cover" style={styles.image}>
                    <TouchableOpacity 
                        style={styles.pressArea}
                        onPress = {() => this.setState({showModal: true})}
                    >
                        {this.state.fontLoaded && <Text style={[styles.title, {fontFamily: 'GameFont'}]}>PRESS THE TRASH PILE TO START</Text>}
                    </TouchableOpacity>
                </ImageBackground>
                <Modal isVisible={this.state.showModal}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{backgroundColor: 'white', paddingVertical: 20, paddingHorizontal: 10, borderRadius: 10}}>
                        <Text style={styles.funFact}>Take a sustainability quiz before the game!</Text>
                            <Pressable style={styles.button} onPress={() => {
                                this.props.navigation.navigate("PreQuiz");
                                this.setState({showModal: false});
                            }}>
                                <Text style={{color: 'white', textAlign: 'center'}}>Take Quiz</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
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
        fontSize: 30,
        fontWeight: 'bold',
        padding: 30,
        textAlign: 'center'
    },
    button: {
        width: 150,
        backgroundColor: "#5E5DF0",
        padding: 10,
        color: 'white',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 30,
        marginBottom: 30,
        borderRadius: 20
    },
    funFact: {
        textAlign: 'center',
        fontSize: 30,
        marginBottom: 30,
        fontWeight: '800',
        color: 'black'
    },
})