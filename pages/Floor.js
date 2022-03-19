import React from "react";
import { View, Text, StyleSheet, ImageBackground, Image } from "react-native";

const Floor = (props) => {
    const width = props.size[0];
    const height = props.size[1];
    const x = props.body.position.x - width / 2;
    const y = props.body.position.y - height / 2;
    const score = props.score;
    const level = props.level;
    const lifeNum = props.life;

    const items = [];

    for(var i = 0; i < lifeNum; i++)
    {
        items.push(<Image key={i} style={{width: 20, height: 20}} source={require('../assets/game/life/life.png')} />)
    }
    
    return (
        <ImageBackground 
            source={require('../assets/game/background/floor.png')}
            style={{
                position: "absolute",
                bottom: 0,
                width: '100%',
                height: '100%'
            }}
        >
            <View style={[styles.textContainer, {
                flex: 1,
                alignItems: 'flex-end',
                marginBottom: 30
            }]}>
                <Text style={styles.textStyle}>Level: {level}</Text>
                <View style={styles.lifeContainer}>
                    <Text style={styles.lifeText}>
                        Lives: 
                    </Text>
                    <View style={styles.lifeImage}>
                    {items}
                    </View>
                </View>
                <Text style={styles.textStyle}>Score: {score}</Text>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    textStyle: {
        color: 'white',
        fontSize: 15,
        padding: 10,
        fontWeight: 'bold'
    },
    textContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    lifeContainer: {
        flexDirection: 'row'
    },
    lifeText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'white',
        padding: 10
    },
    lifeImage: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        paddingLeft: 0,
        paddingBottom: 5,
        alignItems: 'center'
    }
})

export { Floor };