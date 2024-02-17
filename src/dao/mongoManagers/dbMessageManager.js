import messagesModel from "../models/messages.models.js";

class dbMessageManager {
  async createMessage(email, message) {
    try {
      const newMessage = await messagesModel.create({ email, message });
      console.log("newMessage: ", newMessage);
      return newMessage;
    } catch (error) {
      console.error("Error al crear el mensaje:", error);
      throw error;
    }
  }

  async getMessages() {
    return messagesModel.find();
  }
}

export default dbMessageManager;
