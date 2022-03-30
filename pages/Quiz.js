import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Animated, Pressable, ActivityIndicator, ImageBackground } from 'react-native';
import Toast from "react-native-toast-message";
    
export default class Quiz extends Component {

    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            question: "",
            option1: "",
            option2: "",
            option3: "",
            option4: "",
            answer: "",
            pressed1: false,
            pressed2: false,
            pressed3: false,
            pressed4: false,
        }
    }

    componentDidMount() {
        this._isMounted = true;
        axios.get('https://sus-game.herokuapp.com?type=2')
        .then((response) => {
            let data = response.data;
            let random = Math.floor(Math.random() * Object.keys(data['Answer']).length);
            let question = data['Question'][String(random)];
            let option1 = data['Option1'][String(random)];
            let option2 = data['Option2'][String(random)];
            let option3 = data['Option3'][String(random)];
            let option4 = data['Option4'][String(random)];
            let answer = data['Answer'][String(random)];
            if(this._isMounted)
            {
                this.setState({question: question});
                this.setState({option1: option1});
                this.setState({option2: option2});
                this.setState({option3: option3});
                this.setState({option4: option4});
                this.setState({answer: answer});
            }
        })
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    answerQuestion(option) {
        if(option == this.state.answer)
        {
            Toast.show({
                type: 'success',
                text1: 'Correct!',
                visibilityTime: 2000
            })
        }
        else
        {
            Toast.show({
                type: 'error',
                text1: 'Wrong!',
                visibilityTime: 2000
            })
        }

        setTimeout(() => {
            this.props.navigation.navigate("GameOver");
        }, 2000)
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
                            Quiz
                        </Text>
                    </View>
                    {this.state.question === "" ?
                        <ActivityIndicator style={{marginTop: 300}} size="large" />
                        :
                        <View style={styles.info_container}>
                            <Text style={styles.funFact}>{this.state.question}</Text>
                            <Pressable style={[styles.button, {backgroundColor: this.state.pressed1 ? "#5E5DF0" : "#565962"}]} onPress={() => {this.answerQuestion(1); this.setState({pressed1: true})}}>
                                <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 20}}>{this.state.option1}</Text>
                            </Pressable>
                            <Pressable style={[styles.button, {backgroundColor: this.state.pressed2 ? "#5E5DF0" : "#565962"}]} onPress={() => {this.answerQuestion(2); this.setState({pressed2: true})}}>
                                <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 20}}>{this.state.option2}</Text>
                            </Pressable>
                            <Pressable style={[styles.button, {backgroundColor: this.state.pressed3 ? "#5E5DF0" : "#565962"}]} onPress={() => {this.answerQuestion(3); this.setState({pressed3: true})}}>
                                <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 20}}>{this.state.option3}</Text>
                            </Pressable>
                            <Pressable style={[styles.button, {backgroundColor: this.state.pressed4 ? "#5E5DF0" : "#565962"}]} onPress={() => {this.answerQuestion(4); this.setState({pressed4: true})}}>
                                <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 20}}>{this.state.option4}</Text>
                            </Pressable>
                            <Pressable style={styles.goBack} onPress={() => this.props.navigation.navigate("GameOver")}>
                                <Text style={{textAlign: 'center', color: 'white', fontWeight: 'bold'}}>Go Back</Text>
                            </Pressable>
                        </View>
                    }
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
        width: '90%',
        backgroundColor: "#565962",
        padding: 20,
        color: '#445463',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 10,
        borderRadius: 20
    },
    goBack: {
        width: 200,
        backgroundColor: "#5E5DF0",
        padding: 10,
        color: '#445463',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 30,
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