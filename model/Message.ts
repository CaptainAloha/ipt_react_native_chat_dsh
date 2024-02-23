export interface Message {
    id: string;
    type: MessageType;
    createdAt: Date;
    text: string;
    user: string;
    photo: string | null | undefined;
}

export enum MessageType {
    TEXT = 'TEXT', PHOTO = 'PHOTO', LOCATION = 'LOCATION', HAPTICS = 'HAPTICS'
}