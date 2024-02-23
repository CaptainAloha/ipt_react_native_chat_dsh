import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getProperty(key: string) {
    let username: string | null = await AsyncStorage.getItem(key);
    if (!username) {
        throw new Error(key + ' not found');
    }

    return username;
}

export async function setProperty(key: string, value: string) {
    await AsyncStorage.setItem(key, value);
}