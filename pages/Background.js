import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const Background = (props) => {
    
    return (
        <View style={{flex: 1}}>
            <Image 
                source={require('../assets/game/background/background.png')} 
                style={{
                    width: '100%',
                    height: '100%'
                }}
                />
        </View>
    );
};

const styles = StyleSheet.create({
})

export { Background };