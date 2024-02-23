import React, {useEffect, useState} from 'react';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {getProperty, setProperty} from "./util/PreferencesUtil";

export default function Login() {
    const [name, setName] = useState('');
    const navigation: NavigationProp<any> = useNavigation();

    useEffect(() => {
        getProperty('username').then(setName);
    }, []);

    const handleConfirmButton = async () => {
        await setProperty('username', name);
        navigation.navigate('Chat')
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Enter your name:</Text>
            <TextInput
                style={styles.input}
                onChangeText={text => setName(text)}
                value={name}
                placeholder="Your Name"
            />
            <Button
                title="Confirm"
                onPress={handleConfirmButton}
                disabled={!name}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: 20,
        marginBottom: 10,
    },
    input: {
        width: 300,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
});