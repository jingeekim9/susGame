import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, ImageBackground, ActivityIndicator, Pressable, TouchableOpacity, Image } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Matter from "matter-js";
import { Trash } from './Trash';
import { Floor } from './Floor';
import { Background } from './Background';
import { Physics, MoveTrashCan, deleteTrash } from "./Systems";
import { TrashCan } from './TrashCan';
import { useFocusEffect } from '@react-navigation/native';
import Modal from 'react-native-modal';
import axios from 'axios';

function FetchUserData({ gameRunning, onUpdate }) {
  useFocusEffect(
    React.useCallback(() => {
      onUpdate(true)

      return () => onUpdate(false)
    }, [gameRunning, onUpdate])
  );

  return null;
}

const engine = Matter.Engine.create({ enableSleeping: false, gravity: {x: 0, y: 0.5} });

const world = engine.world;

const {width, height} = Dimensions.get("screen");

const boxSize = Math.trunc(Math.max(width, height) * 0.035);

const randomPosition = Math.floor(Math.random() * (width - 10 - 10)) + 10;

const trash = Matter.Bodies.rectangle(randomPosition, 0, boxSize*1.5, boxSize*1.5);

const canTrashCan = Matter.Bodies.rectangle((width / 2)-50, height / 2 + 200, 50, 25, {isStatic: true});

const paperTrashCan = Matter.Bodies.rectangle((width / 2) + 50, height / 2 + 200, 50, 25, {isStatic: true});

const floor = Matter.Bodies.rectangle(width / 2, height - boxSize / 2, width, boxSize*3, { isStatic: true });

const constraint = Matter.Constraint.create({
  label: "Drag Constraint",
  pointA: { x: 0, y: 0 },
  pointB: { x: 0, y: 0 },
  length: 0.01,
  stiffness: 0.1,
  angularStiffness: 1
});

Matter.World.add(world, [trash, canTrashCan, paperTrashCan, floor]);

export default class Recycling extends Component {

  _isMounted = false;
  
  constructor(props) {
    super(props);
    this.state = {
      gameRunning: true,
      score: 0,
      question: [],
      level: 1,
      preQuiz: this.props.route.params.preQuiz,
      quizModalVisible: false,
      pauseModalVisible: false
    }
  }

  componentDidMount() {
    this._isMounted = true;
    axios.get('https://sus-game.herokuapp.com?type=1')
    .then((response) => {
        let data = response.data;
        let arr = [];
        let questions = [];
        while(questions.length < 5)
        {
          let random = Math.floor(Math.random() * Object.keys(data['Questions']).length);
          if(arr.indexOf(random) === -1)
          { 
            questions.push(data['Questions'][String(random)]);
            arr.push(random);
          }
        }

        if(this._isMounted)
        {
            this.setState({question: questions})
        }
    })
  }

  _handleUpdate = gameRunning => {
    this.setState({gameRunning: gameRunning});
    axios.get('https://sus-game.herokuapp.com?type=1')
    .then((response) => {
        let data = response.data;
        let arr = [];
        let questions = [];
        while(questions.length < 5)
        {
          let random = Math.floor(Math.random() * Object.keys(data['Questions']).length);
          if(arr.indexOf(random) === -1)
          { 
            questions.push(data['Questions'][String(random)]);
            arr.push(random);
          }
        }

        this.setState({question: questions})
    })
  }

  render() {
    return (
      <GameEngine
        style={[styles.container]}
        systems={[Physics, MoveTrashCan, deleteTrash]}
        entities={{
          background: {
            renderer: Background
          },
          physics: {
            engine: engine,
            world: world
          },
          trash: {
            body: trash,
            size: [boxSize*1.5, boxSize*1.5],
            trash: 'can',
            type: 0,
            renderer: Trash
          },
          canTrashCan: {
            body: canTrashCan,
            size: [50, 25],
            type: 'can',
            renderer: TrashCan
          },
          paperTrashCan: {
            body: paperTrashCan,
            size: [50, 25],
            type: 'paper',
            renderer: TrashCan
          },
          floor: {
            body: floor,
            size: [width, boxSize*3],
            score: 0,
            level: 1,
            life: 3,
            renderer: Floor
          }
        }}
        running={this.state.gameRunning}
        onEvent={(e) => {
          switch (e) {
            case "game-over":
              this.setState({gameRunning: false})
              this.props.navigation.navigate("GameOver", {score: this.state.score, preQuiz: this.state.preQuiz});
              this.setState({score: 0});
              this.setState({level: 1});
              break;
            
            case "update_score":
              this.setState({score: this.state.score + 1});
              break;
            case "next_level":
              this.setState({level: this.state.level + 1});
              this.setState({gameRunning: false});
              this.setState({quizModalVisible: true});
          }
        }}
      >
        <StatusBar hidden={true} />
        <FetchUserData
          gameRunning={this.props.gameRunning}
          onUpdate={this._handleUpdate}
        />
        <TouchableOpacity 
          style={styles.pause_container}
          onPress={() => {
          this.setState({gameRunning: false});
          this.setState({pauseModalVisible: true});
          }}
          >
          <Image 
            style={styles.pause_image}
            source={require('../assets/pause.png')} 
            />
        </TouchableOpacity>
        <Modal isVisible={this.state.quizModalVisible}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{backgroundColor: 'white', paddingVertical: 20, paddingHorizontal: 10, borderRadius: 10}}>
              <Text style={styles.funFact}>Sustainability Fact</Text>
              {
                this.state.question.length == 0 ?
                <ActivityIndicator size="large" />
                :
                <Text style={styles.questionText}>{this.state.question[this.state.level - 1]}</Text>
              }
                <Pressable style={styles.button} onPress={() => {
                  this.setState({quizModalVisible: false});
                  this.setState({gameRunning: true});
                }}>
                    <Text style={{color: 'white', textAlign: 'center'}}>Play Next Level</Text>
                </Pressable>
            </View>
          </View>
        </Modal>
        <Modal isVisible={this.state.pauseModalVisible}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity 
              onPress={() => {
                this.setState({pauseModalVisible: false});
                this.setState({gameRunning: true})
              }}  
            >
              <View style={{backgroundColor: 'white', width: 200, height: 100, borderRadius: 10, justifyContent: 'center'}}>
                <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 30}}>
                  Play
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
      </GameEngine>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  background: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
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
      color: '#019267'
  },
  questionText: {
      textAlign: 'center',
      paddingLeft: 30,
      paddingRight: 30,
      fontSize: 20,
      fontWeight: '700',
  },
  pause_image: {
    width: 30,
    height: 30
  },
  pause_container: {
    position: 'absolute',
    top: 30,
    right: 30
  },
});