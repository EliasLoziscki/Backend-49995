import mongoose from 'mongoose';
import messagesModel from '../models/messages.models.js';

class MongoMessageManager {
    async getMessages() {
        try {
            const messages = await messagesModel.find();
            return messages;
        } catch (err) {
            console.error(err);
            return [];
        }
    }

    async createMessage(message) {
        try {
            const newMessage = new messagesModel(message);
            await newMessage.save();
            return newMessage;
        } catch (error) {
            console.error("Error al crear el mensaje:", error);
        }
    }
}

export default MongoMessageManager;