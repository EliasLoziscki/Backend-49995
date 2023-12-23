import messagesModel from '../models/messages.models.js';

class MongoMessageManager {
    async createMessage(email, message) {
        const newMessage = await new messagesModel.create({ email, message});
        return newMessage;
    }
    
    async getMessages() {
        return messagesModel.find();
    }
}

export default MongoMessageManager;