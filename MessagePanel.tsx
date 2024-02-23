import {Image, Linking, Platform, ScrollView, StyleSheet, Text, View} from "react-native";
import React, {useEffect, useRef, useState} from "react";
import {fetchMessages} from "./service/MessageService";
import {calculateTextColor} from "./util/ColorUtil";
import {Message, MessageType} from "./model/Message";
import {getProperty} from "./util/PreferencesUtil";
import {formatDate} from "./util/GeneralUtil";
import {LocationObject} from 'expo-location';
import {theme} from "./util/ColorUtil";
import {Icon} from "@rneui/themed";
import * as Haptics from 'expo-haptics';


export default function MessagePanel() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [username, setUsername] = useState<string>('');
    const scrollViewRef = useRef<ScrollView | null>(null);

    useEffect(() => {
        getProperty('username').then(setUsername);

        return fetchMessages((messages) => {
            setMessages(messages);
        });
    }, []);

    async function openMap(locationAsString: string, user: string) {
        const location: LocationObject = JSON.parse(locationAsString)
        const scheme = Platform.select({ios: 'maps://0,0?q=', android: 'geo:0,0?q='});
        const latLng = `${location?.coords.latitude},${location?.coords.longitude}`;
        const label = user + '\'s position';
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });


        if (url != null) {
            await Linking.openURL(url);
        } else {
            console.error('missing url');
        }
    }

    return (
        <ScrollView ref={scrollViewRef} style={styles.messagePanel}
                    onContentSizeChange={() => scrollViewRef?.current?.scrollToEnd({animated: true})}>
            {messages.map((message, index) => {
                const isCurrentUser = message.user === username;
                if (index === messages.length - 1 && message.type === MessageType.HAPTICS) {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).then();
                }

                return (
                    <View key={`${message.id}-${index}`}
                          style={isCurrentUser ? styles.userMessage : styles.receiverMessage}>
                        <Text
                            style={[styles.senderName, {color: calculateTextColor(message.user)}]}>{message.user}</Text>
                        {message.type === MessageType.TEXT &&
                            <Text
                                style={isCurrentUser ? styles.userMessageText : styles.receiverMessageText}>{message.text}</Text>}

                        {message.type === MessageType.PHOTO &&
                            <Image
                                source={{uri: 'data:image/jpeg;base64,' + message.photo}}
                                style={{width: 200, height: 200, marginTop: 8}}
                            />}

                        {message.type === MessageType.LOCATION &&
                            <View style={{flexDirection: 'row', marginTop: 16}}>
                                <Icon name='location-arrow'
                                      type='font-awesome-5'
                                      color={isCurrentUser ? theme.headerColor : theme.headerBackgroundColor}
                                      style={styles.icon}/>
                                <Text onPress={() => openMap(message.text, message.user)}
                                      style={isCurrentUser ? styles.userMessageText : styles.receiverMessageText}>{'press to open the map'}</Text>
                            </View>}

                        {message.type === MessageType.HAPTICS &&
                            <View style={{flexDirection: 'row', marginTop: 16}}>
                                <Icon name='broadcast-tower'
                                      type='font-awesome-5'
                                      color={isCurrentUser ? theme.headerColor : theme.headerBackgroundColor}
                                      style={styles.icon}/>
                                <Text
                                    style={isCurrentUser ? styles.userMessageText : styles.receiverMessageText}>{'Let\'s vibrate!'}</Text>
                            </View>}

                        <Text style={isCurrentUser ? styles.userMessageTime : styles.receiverMessageTime}>
                            {formatDate(message.createdAt)}
                        </Text>
                    </View>
                );
            })}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    messagePanel: {
        paddingHorizontal: 20,
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#0084FF',
        borderRadius: 8,
        padding: 8,
        marginTop: 8,
        maxWidth: '70%',
    },
    receiverMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#E5E5EA',
        borderRadius: 8,
        padding: 8,
        marginTop: 8,
        maxWidth: '70%',
    },
    senderName: {
        fontSize: 12,
    },
    userMessageText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    receiverMessageText: {
        color: '#000000',
        fontSize: 16,
    },

    userMessageTime: {
        color: '#FFFFFF',
        fontSize: 8,
        textAlign: 'right'
    },
    receiverMessageTime: {
        color: '#000000',
        fontSize: 8,
        textAlign: 'right',
        marginTop: 4
    },
    icon: {
        width: 30,
        height: 30,
        marginRight: 4
    }
})