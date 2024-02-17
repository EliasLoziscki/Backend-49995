import dbMessageManager from "../dao/mongoManagers/dbMessageManager.js";

const mongoMessageManager = new dbMessageManager();


const message = async (req, res) => { 
    try {
        const { email, message } = req.body;
        await mongoMessageManager.createMessage(email, message);
        res.redirect("/");
    } catch (error) {
        console.error("Error creando mensaje:", error);
        res.status(400).send({ error: error.toString() });
    }
}

export { message };