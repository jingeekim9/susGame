import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Animated, Pressable, ActivityIndicator, ImageBackground } from 'react-native';
    
export default class GameOver extends Component {

    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            question: ""
        }
        this.opacity = new Animated.Value(0);
    }

    componentDidMount() {
        this._isMounted = true;
        axios.get('https://sus-game.herokuapp.com/')
        .then((response) => {
            let data = response.data;
            let random = Math.floor(Math.random() * Object.keys(data['Questions']).length);
            let question = data['Questions'][String(random)];
            if(this._isMounted)
            {
                this.setState({question: question})
            }
        })
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return(
            <View style={styles.container}>
                <ImageBackground
                    source={require('../assets/home/clean_pile.png')}
                    style={{
                        width: '100%',
                        height: '100%'
                    }}
                >
                    <View style={styles.title}>
                        <Text style={styles.titleText}>
                            Game Over
                        </Text>
                    </View>
                    <View style={styles.info_container}>
                        <Text style={styles.funFact}>Sustainability Fact</Text>
                        {this.state.question === "" ?
                            <ActivityIndicator size="large" />
                            :
                            <Text style={styles.questionText}>{this.state.question}</Text>
                        }
                        <View style={{
                            marginTop: 100
                        }}>
                            <Text style={{
                                textAlign: 'center',
                                fontWeight: 'bold'
                            }}>Take a quiz to test your sustainability knowledge!</Text>
                        </View>
                        <Pressable style={styles.button} onPress={() => this.props.navigation.navigate("Quiz")}>
                            <Text style={{color: 'white', textAlign: 'center'}}>Take Quiz</Text>
                        </Pressable>
                        <View>
                            <Text style={{textAlign: 'center'}}>or</Text>
                        </View>
                        <Pressable style={styles.button} onPress={() => this.props.navigation.navigate("Recycling")}>
                            <Text style={{color: 'white', textAlign: 'center'}}>Start Over</Text>
                        </Pressable>
                    </View>
                </ImageBackground>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        marginTop: 100,
    },
    titleText: {
        textAlign: 'center',
        fontSize: 40,
        fontWeight: 'bold'
    },  
    button: {
        width: 100,
        backgroundColor: "#5E5DF0",
        padding: 10,
        color: 'white',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 30,
        marginBottom: 30,
        borderRadius: 20
    },
    info_container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center'
    },
    questionText: {
        textAlign: 'center',
        paddingLeft: 30,
        paddingRight: 30,
        fontSize: 20,
        fontWeight: '700',
    },
    funFact: {
        textAlign: 'center',
        fontSize: 30,
        marginBottom: 30,
        fontWeight: '800',
        color: '#019267'
    }
})