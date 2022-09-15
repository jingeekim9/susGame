import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Animated, Pressable, ActivityIndicator, ImageBackground, Keyboard, TouchableWithoutFeedback, TextInput } from 'react-native';
import Modal from 'react-native-modal';
import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc, query, orderBy, limit, collection, getDocs, addDoc } from 'firebase/firestore';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

// Initialize Firebase
const firebaseConfig = {
    apiKey: 'AIzaSyBbukxcDKGVop75ec-IP1LPiOLzkiD9wJI',
    authDomain: 'sustainabilitygame-6358e.firebaseapp.com',
    databaseURL: 'https://sustainabilitygame-6358e.firebaseio.com',
    projectId: 'sustainabilitygame-6358e',
    storageBucket: 'sustainabilitygame-6358e.appspot.com'
};

let myApp = initializeApp(firebaseConfig);

const db = getFirestore(myApp);

export default class GameOver extends Component {

    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            question: "",
            score: this.props.route.params.score,
            preQuiz: this.props.route.params.preQuiz,
            showModal: true,
            leaderboard: [],
            showLeaderboard: false,
            leaderboardName: ""
        }
        this.opacity = new Animated.Value(0);
    }

    async getLeaderboardData() {
        const ref = collection(db, "Leaderboard");
        const q = query(ref, orderBy("score", "desc"), limit(5));
        const querySnapshot = await getDocs(q);
        let tempArray = [];
        querySnapshot.forEach((doc) => {
            let data = doc.data();
            let tempDict = {};
            tempDict['name'] = data['name'];
            tempDict['score'] = data['score'];
            tempArray.push(tempDict);
        })
        this.setState({leaderboard: tempArray});
    }

    componentDidMount() {
        this._isMounted = true;
        axios.get('https://sus-game.herokuapp.com?type=1')
        .then((response) => {
            let data = response.data;
            let random = Math.floor(Math.random() * Object.keys(data['Questions']).length);
            let question = data['Questions'][String(random)];
            if(this._isMounted)
            {
                this.setState({question: question});
            }
        });

        this.getLeaderboardData();
    }

    async addLeaderboardData() {
        const newLeaderboardRef = await addDoc(collection(db, 'Leaderboard'), {
            name: this.state.leaderboardName,
            score: this.state.score
        });
        this.getLeaderboardData();
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
                    <Pressable
                        style={[styles.button, {position: 'absolute', top: 30, right: 20, borderRadius: 5, width: 120}]}
                        onPress={() => this.setState({showLeaderboard: true})}
                    >
                        <Text style={{color: 'white', textAlign: 'center'}}>Leaderboard</Text>
                    </Pressable>
                    <View style={styles.title}>
                        <Text style={styles.titleText}>
                            Game Over
                        </Text>
                        <Text style={styles.score}>
                            Score: {this.state.score}
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
                        <Pressable style={styles.button} onPress={() => this.props.navigation.navigate("Quiz", {preQuiz: this.state.preQuiz})}>
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
                <Modal
                    isVisible={this.state.showModal}
                    onBackdropPress={Keyboard.dismiss}
                >
                    <TouchableWithoutFeedback style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} onPress={Keyboard.dismiss}>
                        <View style={{backgroundColor: 'white', paddingVertical: 20, paddingHorizontal: 10, borderRadius: 10}}>
                            <Text style={styles.saveTitle}>Input your name to save your score!</Text>
                            <TextInput 
                                style={styles.nameInput}
                                placeholder="Name"
                                returnKeyType={'done'}
                                autoCapitalize={'none'}
                                placeholderTextColor={'gray'}
                                onChangeText={newText => this.setState({leaderboardName: newText})}
                            />
                            <View style={{flexDirection: 'row'}}>
                                <Pressable style={styles.button} onPress={() => this.setState({showModal: false})}>
                                    <Text style={{color: 'white', textAlign: 'center'}}>Don't Save</Text>
                                </Pressable>
                                <Pressable style={styles.button} onPress={() => {
                                    this.addLeaderboardData();
                                    this.setState({showModal: false});
                                    }}>
                                    <Text style={{color: 'white', textAlign: 'center'}}>Save</Text>
                                </Pressable>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
                <Modal
                    isVisible={this.state.showLeaderboard}
                    onBackdropPress={Keyboard.dismiss}
                >
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <View style={{backgroundColor: 'white', paddingVertical: 20, paddingHorizontal: 10, borderRadius: 10, width: '80%'}}>
                            <Text style={styles.saveTitle}>Leaderboard</Text>
                            <View style={[styles.leaderboardContainer, {marginTop: 30}]}>
                                <View style={{width: '33%'}}>
                                    <Text style={{textAlign: 'left', fontSize: hp(2), fontWeight: 'bold'}}>
                                        Ranking
                                    </Text>
                                </View>
                                <View style={{width: '33%'}}>
                                    <Text style={{textAlign: 'left', fontSize: hp(2), fontWeight: 'bold'}}>
                                        Name
                                    </Text>
                                </View>
                                <View style={{width: '33%'}}>
                                    <Text style={{textAlign: 'left', fontSize: hp(2), fontWeight: 'bold'}}>
                                        Score
                                    </Text>
                                </View>
                            </View>
                            {
                                this.state.leaderboard.length == 0 ?
                                <View>
                                    <Text style={{
                                        textAlign: 'center',
                                        marginTop: hp(2)
                                    }}>
                                        There is currently no data.
                                    </Text>
                                </View>
                                :
                                this.state.leaderboard.map((el, ind) => (
                                    <View style={[styles.leaderboardContainer, {marginTop: 10}]} key={ind}>
                                        <View style={{width: '33%'}}>
                                            <Text style={{textAlign: 'left', fontSize: hp(2), fontWeight: '400'}}>
                                                {ind + 1}
                                            </Text>
                                        </View>
                                        <View style={{width: '33%'}}>
                                            <Text style={{textAlign: 'left', fontSize: hp(2), fontWeight: '400'}}>
                                                {el['name']}
                                            </Text>
                                        </View>
                                        <View style={{width: '33%'}}>
                                            <Text style={{textAlign: 'left', fontSize: hp(2), fontWeight: '400'}}>
                                                {el['score']}
                                            </Text>
                                        </View>
                                    </View>
                                ))
                            }
                            <Pressable style={[styles.button, {marginTop: 20}]} onPress={() => this.setState({showLeaderboard: false})}>
                                <Text style={{color: 'white', textAlign: 'center'}}>Close</Text>
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
    score: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20
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
    },
    saveTitle: {
        textAlign: 'center',
        fontSize: 25,
        fontWeight: 'bold',
        color: 'black'
    },
    nameInput: {
        height: 70,
        marginTop: 10,
        paddingLeft: 30,
        paddingRight: 30,
        color: 'black',
        fontWeight: 'bold',
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 15,
        marginBottom: 20
    },
    leaderboardContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
})