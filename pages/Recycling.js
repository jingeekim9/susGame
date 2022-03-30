import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, ImageBackground } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Matter from "matter-js";
import { Trash } from './Trash';
import { Floor } from './Floor';
import { Background } from './Background';
import { Physics, MoveTrashCan, deleteTrash } from "./Systems";
import { TrashCan } from './TrashCan';
import { useFocusEffect } from '@react-navigation/native';

function FetchUserData({ gameRunning, onUpdate }) {
  useFocusEffect(
    React.useCallback(() => {
      onUpdate(true)

      return () => onUpdate(false)
    }, [gameRunning, onUpdate])
  );

  return null;
}

const engine = Matter.Engine.create({ enableSleeping: false });

const world = engine.world;

const {width, height} = Dimensions.get("screen");

const boxSize = Math.trunc(Math.max(width, height) * 0.035);

const randomPosition = Math.floor(Math.random() * (width - 10 - 10)) + 10;

const trash = Matter.Bodies.rectangle(randomPosition, 0, boxSize, boxSize);

const trashCan = Matter.Bodies.rectangle(width / 2, height / 2 + 200, 50, 25, {isStatic: true});

const floor = Matter.Bodies.rectangle(width / 2, height - boxSize / 2, width, boxSize*3, { isStatic: true });

const constraint = Matter.Constraint.create({
  label: "Drag Constraint",
  pointA: { x: 0, y: 0 },
  pointB: { x: 0, y: 0 },
  length: 0.01,
  stiffness: 0.1,
  angularStiffness: 1
});

Matter.World.add(world, [trash, trashCan, floor]);

export default class Recycling extends Component {

  constructor(props) {
    super(props);
    this.state = {
      gameRunning: true,
      score: 0
    }
  }

  _handleUpdate = gameRunning => {
    this.setState({gameRunning: gameRunning})
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
            size: [boxSize, boxSize],
            trash: 'can',
            type: 0,
            renderer: Trash
          },
          trashCan: {
            body: trashCan,
            size: [50, 25],
            type: 'can',
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
              this.props.navigation.navigate("GameOver", {score: this.state.score});
              break;
            
            case "update_score":
              this.setState({score: this.state.score + 1});
          }
        }}
      >
        <StatusBar hidden={true} />
        <FetchUserData
          gameRunning={this.props.gameRunning}
          onUpdate={this._handleUpdate}
        />
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
  }
});