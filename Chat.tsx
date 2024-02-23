import React from 'react';
import MessagePanel from "./MessagePanel";
import {View} from "react-native";
import MessageInput from "./MessageInput";

export default function Chat() {

    return (
        <View style={{flex: 1}}>
            <MessagePanel/>
            <MessageInput/>
        </View>
    );
}