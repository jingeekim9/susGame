import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Animated, Pressable, ActivityIndicator, ImageBackground } from 'react-native';
import Toast from "react-native-toast-message";
import Modal from 'react-native-modal';
    
export default class PreQuiz extends Component {

    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            question: [],
            option1: [],
            option2: [],
            option3: [],
            option4: [],
            answer: [],
            right1: false,
            right2: false,
            right3: false,
            right4: false,
            wrong1: false,
            wrong2: false,
            wrong3: false,
            wrong4: false,
            right: 0,
            quesNum: 0,
            curQuestion: 0,
            showModal: false,
            canPress: true
        }
    }

    componentDidMount() {
        this._isMounted = true;
        axios.get('https://sus-game.herokuapp.com?type=2')
        .then((response) => {
            let data = response.data;
            let arr = [];
            let questions = [];
            let option1 = [];
            let option2 = [];
            let option3 = [];
            let option4 = [];
            let answer = [];
            while(questions.length < 5)
            {
                let random = Math.floor(Math.random() * Object.keys(data['Answer']).length);
                if(arr.indexOf(random) === -1)
                {
                    questions.push(data['Question'][String(random)]);
                    option1.push(data['Option1'][String(random)]);
                    option2.push(data['Option2'][String(random)]);
                    option3.push(data['Option3'][String(random)]);
                    option4.push(data['Option4'][String(random)]);
                    answer.push(data['Answer'][String(random)]);
                    arr.push(random);
                } 
            }
            if(this._isMounted)
            {
                this.setState({question: questions});
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
        this.setState({quesNum: this.state.quesNum + 1});
        this.setState({canPress: false});
        if(option == this.state.answer[this.state.curQuestion])
        {
            Toast.show({
                type: 'success',
                text1: 'Correct!',
                visibilityTime: 2000
            });

            this.setState({right: this.state.right + 1});

            if(option == 1)
            {
                this.setState({right1: true});
            }
            else if(option == 2)
            {
                this.setState({right2: true});
            }
            else if(option == 3)
            {
                this.setState({right3: true});
            }
            else if(option == 4)
            {
                this.setState({right4: true});
            }
        }
        else
        {
            Toast.show({
                type: 'error',
                text1: 'Wrong!',
                visibilityTime: 2000
            });
            if(option == 1)
            {
                this.setState({wrong1: true});
            }
            else if(option == 2)
            {
                this.setState({wrong2: true});
            }
            else if(option == 3)
            {
                this.setState({wrong3: true});
            }
            else if(option == 4)
            {
                this.setState({wrong4: true});
            }
        }
        if(this.state.curQuestion == 4)
        {
            this.setState({showModal: true})
        }
    }

    next() {
        this.setState({curQuestion: this.state.curQuestion + 1});
        this.setState({right1: false});
        this.setState({right2: false});
        this.setState({right3: false});
        this.setState({right4: false});
        this.setState({wrong1: false});
        this.setState({wrong2: false});
        this.setState({wrong3: false});
        this.setState({wrong4: false});
        this.setState({canPress: true});
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
                    <Text style={styles.curScore}>{this.state.right} / {this.state.quesNum}</Text>
                    <View style={styles.title}>
                        <Text style={styles.titleText}>
                            Quiz
                        </Text>
                    </View>
                    {this.state.question === "" ?
                        <ActivityIndicator style={{marginTop: 300}} size="large" />
                        :
                        <View style={styles.info_container}>
                            <Text style={styles.funFact}>{this.state.question[this.state.curQuestion]}</Text>
                            <Pressable disabled={!this.state.canPress} style={[styles.button, {backgroundColor: this.state.right1 ? "#5E5DF0" : this.state.wrong1 ? '#F24A72' : "#565962"}]} onPress={() => {this.answerQuestion(1);}}>
                                <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 20}}>{this.state.option1[this.state.curQuestion]}</Text>
                            </Pressable>
                            <Pressable disabled={!this.state.canPress} style={[styles.button, {backgroundColor: this.state.right2 ? "#5E5DF0" : this.state.wrong2 ? '#F24A72' : "#565962"}]} onPress={() => {this.answerQuestion(2);}}>
                                <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 20}}>{this.state.option2[this.state.curQuestion]}</Text>
                            </Pressable>
                            <Pressable disabled={!this.state.canPress} style={[styles.button, {backgroundColor: this.state.right3 ? "#5E5DF0" : this.state.wrong3 ? '#F24A72' : "#565962"}]} onPress={() => {this.answerQuestion(3);}}>
                                <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 20}}>{this.state.option3[this.state.curQuestion]}</Text>
                            </Pressable>
                            <Pressable disabled={!this.state.canPress} style={[styles.button, {backgroundColor: this.state.right4 ? "#5E5DF0" : this.state.wrong4 ? '#F24A72' : "#565962"}]} onPress={() => {this.answerQuestion(4);}}>
                                <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 20}}>{this.state.option4[this.state.curQuestion]}</Text>
                            </Pressable>
                            <View>
                                {
                                    this.state.curQuestion < 4 &&
                                    <Pressable style={styles.nextQuestion} onPress={() => {
                                        this.next();
                                        }}>
                                        <Text style={{textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: 20}}>Next Question</Text>
                                    </Pressable>
                                }
                                <Pressable style={styles.goBack} onPress={() => this.props.navigation.navigate("Home")}>
                                    <Text style={{textAlign: 'center', color: 'white', fontWeight: 'bold'}}>Go Back</Text>
                                </Pressable>
                            </View>
                        </View>
                    }
                </ImageBackground>
                <Modal isVisible={this.state.showModal}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{backgroundColor: 'white', paddingVertical: 20, paddingHorizontal: 10, borderRadius: 10}}>
                        <Text style={styles.funFact}>{this.state.right >= 3 ? "Good Job!" : "Do Better Next Time!"}</Text>
                            <Text style={styles.questionText}>You got {this.state.right} question(s) correct!</Text>
                            <Pressable style={styles.goBack} onPress={() => {
                                this.setState({showModal: false});
                                this.props.navigation.navigate("Recycling", {preQuiz: this.state.right});
                            }}>
                                <Text style={{color: 'white', textAlign: 'center'}}>Play Game</Text>
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
    nextQuestion: {
        width: 200,
        backgroundColor: "#5E5DF0",
        padding: 20,
        color: '#445463',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 30,
        borderRadius: 30
    },
    goBack: {
        width: 150,
        backgroundColor: "#F24A72",
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
    },
    curScore: {
        position: 'absolute',
        right: 50,
        top: 50
    }
})