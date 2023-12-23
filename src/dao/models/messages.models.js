import mongoose from 'mongoose';

const collection = 'messages';

const messagesSchema = new mongoose.Schema({
    email: { 
        type: String,
        required: true},
    message: {
        type: String, 
        required: true}
});

const messagesModel = mongoose.model(collection, messagesSchema);

export default messagesModel;

