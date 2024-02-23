import ChatScreen from "./Chat";
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from "./Login";
import {KeyboardAvoidingView, Platform, StyleSheet} from "react-native";
import 'react-native-get-random-values'
import {theme} from "./util/ColorUtil";

const Stack = createNativeStackNavigator();

export default function App() {

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen
                        name="Login"
                        component={Login}
                        options={crateHeaderOptions('Login')}
                    />
                    <Stack.Screen
                        name="Chat"
                        component={ChatScreen}
                        options={crateHeaderOptions('ipt Chat')}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </KeyboardAvoidingView>
    );

    function crateHeaderOptions(title: string) {
        return {
            headerTitle: title,
            headerStyle: {
                backgroundColor: theme.headerBackgroundColor,
            },
            headerTintColor: theme.headerColor,
            headerTransparent: false,
        };
    }
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});