// {{!-- {user:correoDeUsuario, message:mensaje de usuario} --}}
// {{!-- // Aspectos a incluir:
// agregar el modelo de persistencia de Mongo a mongoose a tu proyecto
// Crear una base de datos llamada "e-commerce" dentro de tu Atlas, crear sus colecciones "carts", "messages", "products" y sus respectivos schemas.
// Separar los Managers de fileSystem de los managers de MongoDb en una sola carpeta "dao". Dentro de dao, agregar también una carpeta "models" donde vivirán los esquemas de MongoDB. La estructura deberá ser igual a la vista en esta clase.
// Contener todos los Managers (fileSystem y DB) en una carpeta llamada "Dao"
//Reajustar los servicios con el fin de que puedan funcionar con Mongoose en lugar de FileSystem
//NO ELIMINAR FileSystem de tu proyecto
//Implementar una vista nueva en handlebars llamada chat.handlebars, la cual permita implementar un chat como el visto en clase. Los mensajes deberán guardarse en una colección "messages" en mongo (no es necesario implementar FileSystem) El formato es: {user:correoDeUsuario, message:mensaje de usuario}
//Corroborar la integridad del proyecto para que todo funcione como ha hecho hasta ahora. --}}

import { Router } from 'express';
import messagesModel from '../dao/models/messages.models.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        let messages = await messagesModel.find().lean();
        res.render("chat", { messages, style:"index" });
    } catch (error) {
        console.error("Error al obtener mensajes:", error);
        res.send({
            status: "error",
            msg: "Error al obtener mensajes"
        });
    }
});

router.post('/', async (req, res) => {
    try {
        const { user, message } = req.body;
        if (!user || !message) {
            return res.status(400).send({
                status: "error",
                msg: "Valores incompletos"
            });
        }

        const messages = {
            user,
            message
        }

        const messagesCreate = await messagesModel.create(messages);

        res.send({
            status:"success",
            msg:"Mensaje creado",
            producto: messagesCreate
        })
    } catch (error) {
        console.error("Error al crear mensaje:", error);
        res.send({
            status: "error",
            msg: "Error al crear mensaje"
        });
    }
});

export {router as messageRouter}