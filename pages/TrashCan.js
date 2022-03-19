import React from "react";
import Animated from "react-native-reanimated";
import { Image } from "react-native";

const TrashCan = (props) => {
    const width = props.size[0];
    const height = props.size[1];
    const x = props.body.position.x - width / 2;
    const y = props.body.position.y - height / 2 - 50;
    const type = props.type;
    const can = require('../assets/game/trashcan/can.png');
    const paper = require('../assets/game/trashcan/paper.png');
    const plastic = require('../assets/game/trashcan/plastic.png');

    return (
        <Image 
            source={type == "can" ?
                can
            :
                type == "paper" ?
                paper
            :
                plastic
        }
            style={{
                position: "absolute",
                left: x,
                top: y,
                width: width,
                resizeMode: 'contain'           
            }}
        />
        // <Animated.View 
        //     style={{
        //         position: "absolute",
        //         left: x,
        //         top: y,
        //         width: width,
        //         height: height,
        //         backgroundColor: 'blue'
        //     }}
        // />
    );
};

export { TrashCan };