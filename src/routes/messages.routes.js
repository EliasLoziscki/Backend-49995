import { Router } from 'express';
import MongoMessageManager from '../dao/mongoManagers/MongoMessageManager.js';

const router = Router();
const mongoMessageManager = new MongoMessageManager();

router.get('/', async (req, res) => {
    const message = await mongoMessageManager.getMessages();
    console.log("message: ", message);
    res.render('chat', { message });
});

router.post('/', async (req, res) => {
    try {
        const { email, message } = req.body;
        await mongoMessageManager.createMessage(email, message);
        res.redirect('/');
    } catch (error) {
        console.error("Error creando mensaje:", error);
        res.status(400).send({ error: error.toString() });
    }
});


export { router as messageRouter };