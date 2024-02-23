import * as ImagePicker from "expo-image-picker";
import {MediaTypeOptions} from "expo-image-picker";
import {ActionResize} from "expo-image-manipulator/src/ImageManipulator.types";
import {manipulateAsync} from "expo-image-manipulator";

export async function pickImage(consumer: (base64: string) => void) {
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
    });

    if (!result.canceled) {
        const photo = result.assets[0];
        const action: ActionResize = {resize: {height: 500}};
        let resizedImageBase64 = await manipulateAsync(photo.uri, [action], {base64: true});
        let base64 = resizedImageBase64.base64;
        if (base64) {
            consumer(base64);
        }
    }
}

export async function takeImage(consumer: (base64: string) => void) {
    const result = await ImagePicker.launchCameraAsync({
        mediaTypes: MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
    });

    if (!result.canceled) {
        const photo = result.assets[0];
        const action: ActionResize = {resize: {height: 500}};
        let resizedImageBase64 = await manipulateAsync(photo.uri, [action], {base64: true});
        let base64 = resizedImageBase64.base64;
        if (base64) {
            consumer(base64);
        }
    }
}