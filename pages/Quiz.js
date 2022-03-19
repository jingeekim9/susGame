import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Animated, Pressable, ActivityIndicator } from 'react-native';
    
export default class Quiz extends Component {

    constructor(props) {
        super(props);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return(
            <View style={styles.container}>
                <View style={styles.title}>
                    <Text style={styles.titleText}>
                        Quiz
                    </Text>
                </View>
                <View style={styles.info_container}>
                    <Text style={styles.funFact}>Question</Text>
                    <View style={styles.button}>
                        <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 20}}>Answer 1</Text>
                    </View>
                    <View style={styles.button}>
                        <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 20}}>Answer 2</Text>
                    </View>
                    <View style={styles.button}>
                        <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 20}}>Answer 3</Text>
                    </View>
                    <View style={styles.button}>
                        <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 20}}>Answer 4</Text>
                    </View>
                </View>
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