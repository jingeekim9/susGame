import React from "react";
import Animated from "react-native-reanimated";
import { Image } from "react-native";

const Trash = (props) => {
    const [trashName, setTrashName] = React.useState("");
    const width = props.size[0];
    const height = props.size[1];
    const x = props.body.position.x - width / 2;
    const y = props.body.position.y - height / 2;
    const trash = props.trash;
    const type = props.type;
    const can1 = require("../assets/game/trash/can/type1.png");
    const can2 = require("../assets/game/trash/can/type2.png");
    const can3 = require("../assets/game/trash/can/type3.png");
    const paper1 = require("../assets/game/trash/paper/type1.png");
    const paper2 = require("../assets/game/trash/paper/type2.png");
    const paper3 = require("../assets/game/trash/paper/type3.png");
    const plastic1 = require("../assets/game/trash/plastic/type1.png");
    const plastic2 = require("../assets/game/trash/plastic/type2.png");
    const plastic3 = require("../assets/game/trash/plastic/type3.png");

    return (
        <Image 
            source={trash == 'can' ? 
            (
                type == 0 ?
                    can1
                :
                type == 1 ?
                    can2
                :
                    can3
            )
            :
            trash == 'paper' ?
                (
                    type == 0 ?
                        paper1
                    :
                    type == 1 ?
                        paper2
                    :
                        paper3
                )
            :
            (
                type == 0 ?
                    plastic1
                :
                type == 1 ?
                    plastic2
                :
                    plastic3
            )

        }
            style={{
                position: "absolute",
                left: x,
                top: y,
                width: width,
                height: height,
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

export { Trash };