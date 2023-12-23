import { Router } from 'express';
import MongoMessageManager from '../dao/mongoManagers/MongoMessageManager.js';

const router = Router();
const mongoMessageManager = new MongoMessageManager();

router.get('/', async (req, res) => {
    const messages = await mongoMessageManager.getMessages();
    res.render('chat', { messages });
});

router.post('/', async (req, res) => {
    const { email, message } = req.body;
    await mongoMessageManager.createMessage(email, message);
    res.redirect('/');
});

export { router as messageRouter };