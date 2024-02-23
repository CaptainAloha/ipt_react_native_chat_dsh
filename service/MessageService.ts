import {addDoc, collection, onSnapshot, orderBy, query} from "firebase/firestore";
import {database} from "../config/firebase";
import {Message} from "../model/Message";


const firebaseCollectionName = 'chat';

export function fetchMessages(onMessagesReceived: (message: Message[]) => void) {
    let databaseCollection = collection(database, firebaseCollectionName);
    const q = query(databaseCollection, orderBy('createdAt', 'asc'));
    return onSnapshot(q, querySnapshot => {
        let messages: Message[] = querySnapshot.docs.map(doc => {
            let message: Message = {
                id: <string>doc.data()._id,
                createdAt: <Date>doc.data().createdAt.toDate(),
                text: <string>doc.data().text,
                user: <string>doc.data().user,
                type: (<string>doc.data().type ? <any>doc.data().type : 'text').toUpperCase(),
                photo: <string>doc.data().photo
            };
            return message;
        });
        onMessagesReceived(messages);
    });
}

export function sendMessages(message: Message) {
    let databaseCollection = collection(database, firebaseCollectionName);
    addDoc(databaseCollection, message).then(r => console.log(r));
}