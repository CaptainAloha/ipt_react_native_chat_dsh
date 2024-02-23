import {Keyboard, StyleSheet, TextInput, TouchableOpacity, View} from "react-native";
import React, {useEffect, useRef, useState} from "react";
import {v4 as uuid} from 'uuid'
import {sendMessages} from "./service/MessageService";
import {Icon} from "@rneui/themed";
import {theme} from "./util/ColorUtil";
import {Message, MessageType} from "./model/Message";
import {pickImage, takeImage} from "./util/ImageUtil";
import {Camera} from "expo-camera";
import {getProperty} from "./util/PreferencesUtil";
import ActionSheet from 'react-native-actionsheet'
import * as Location from 'expo-location';
import {Accelerometer} from 'expo-sensors';
import {Subscription} from "expo-modules-core/src/EventEmitter";
import {getRandomEmoji} from "./util/GeneralUtil";

export default function MessageInput() {
    const [newMessage, setNewMessage] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null | undefined>(null);
    const [messageType, setMessageType] = useState<MessageType>(MessageType.TEXT);
    const [sendMessage, setSendMessage] = useState<boolean>(false);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const actionSheet = useRef<ActionSheet | null>(null);
    const [subscription, setSubscription] = useState<Subscription | null>(null);

    const _unsubscribe = () => {
        subscription && subscription.remove();
        setSubscription(null);
    };

    useEffect(() => {
        let lastTimestamp = 0;
        let shakeDetected = false;

        Accelerometer.setUpdateInterval(200);
        let subscription = Accelerometer.addListener((data) => {
            if (!data) {
                return;
            }

            let timestamp = Date.now();
            const delta = timestamp - lastTimestamp;

            const acceleration = Math.sqrt(data.x ** 2 + data.y ** 2 + data.z ** 2);
            const shakeThreshold = 4;
            const shakeDuration = 500;

            if (!shakeDetected && acceleration > shakeThreshold && delta < shakeDuration) {
                shakeDetected = true;
                setTimeout(() => {
                    shakeDetected = false
                }, 2000);
                setNewMessage(getRandomEmoji());
                setSendMessage(true);
            }

            lastTimestamp = timestamp;
        });
        setSubscription(subscription);
        return () => _unsubscribe();
    }, []);

    useEffect(() => {
        if (sendMessage) {
            if (messageType === MessageType.TEXT && newMessage.trim() === '') {
                return;
            }

            getProperty('username').then(username => {
                const newMessageObj: Message = {
                    id: uuid(),
                    type: messageType,
                    createdAt: new Date(),
                    text: newMessage,
                    user: username,
                    photo: selectedImage
                };

                sendMessages(newMessageObj);

                setNewMessage('');
                setSelectedImage(null);
                setMessageType(MessageType.TEXT);
                setSendMessage(false);
                Keyboard.dismiss();
            });
        }
    }, [sendMessage])


    async function handleTakeImage() {
        await requestPermission()
        if (permission?.granted) {
            setMessageType(MessageType.PHOTO);
            await takeImage((image) => {
                setSelectedImage(image);
                setSendMessage(true);
            });
        } else {
            console.error(permission?.status);
        }
    }

    function showActionSheet() {
        actionSheet.current?.show();
    }

    async function handlePickImage() {
        setMessageType(MessageType.PHOTO);
        await pickImage((image) => {
            setSelectedImage(image);
            setSendMessage(true);
        });
    }

    async function handleShareLocation() {
        let {status} = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.error('Permission to access location was denied');
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setMessageType(MessageType.LOCATION);
        setNewMessage(JSON.stringify(location));
        setSendMessage(true);
    }

    async function sendHapticMessage() {
        setMessageType(MessageType.HAPTICS);
        setSendMessage(true);
    }

    return (
        <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.photoButton} onPress={handleTakeImage}>
                <Icon name='camera'
                      type='font-awesome-5'
                      color={theme.headerColor}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.moreButton} onPress={showActionSheet}>
                <Icon name='plus'
                      type='font-awesome-5'
                      color={theme.headerColor}/>
            </TouchableOpacity>
            <ActionSheet
                ref={actionSheet}
                options={['Select image', 'Share location', 'Let\'s vibrate', 'Cancel']}
                cancelButtonIndex={3}
                onPress={async (index) => {
                    if (index === 0) {
                        await handlePickImage()
                    } else if (index === 1) {
                        await handleShareLocation();
                    } else if (index === 2) {
                        await sendHapticMessage();
                    }
                }}
            />
            <TextInput
                style={styles.input}
                placeholder="Type your message..."
                value={newMessage}
                onChangeText={(text) => setNewMessage(text)}
            />
            <TouchableOpacity style={styles.sendButton} onPress={() => setSendMessage(true)}>
                <Icon name='paper-plane'
                      type='font-awesome-5'
                      color={theme.headerColor}/>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 24,
        borderTopWidth: 1,
        borderColor: '#CCCCCC',
        backgroundColor: theme.headerBackgroundColor,
    },
    input: {
        flex: 1,
        height: 40,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingHorizontal: 16,
    }, sendButton: {
        marginRight: 4,
        marginLeft: 8
    }, photoButton: {
        marginRight: 8,
        marginLeft: 4
    }, moreButton: {
        marginRight: 8,
        marginLeft: 8
    }
})