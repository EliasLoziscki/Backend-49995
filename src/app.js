import express from "express";
import mongoose from "mongoose";
import { engine } from "express-handlebars";
import passport from "passport";
import viewRouter from "./routes/views.routes.js";
import __dirname from "./utils.js"; 
import { Server } from "socket.io";
import MongoMessageManager from "./dao/mongoManagers/MongoMessageManager.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import sessionRouter from "./routes/sessions.routes.js";
import productModel from "./dao/models/products.model.js";
import inicializePassport from "./config/passport.config.js";
import { MongoProductRouter } from "./routes/dbProducts.routes.js";
import { MongoCartRouter } from "./routes/dbCarts.routes.js";

const PORT = 8080;
let messages = [];
const app = express();

const MONGO = "mongodb+srv://waloz87:ASVmPWp4oZdPUTc2@cluster0.tul15f7.mongodb.net/ecommerce"
const connection = mongoose.connect(MONGO)

app.use(express.json()) 
app.use(express.urlencoded({extended:true})) 

const httpServer = app.listen(PORT, ()=> console.log(`Servidor funcionando en el puerto: ${PORT}`)); //Se crea el servidor http con express y se lo asigna a una constante para poder usarlo en el socket server

app.use(session({
    store: new MongoStore({ 
        mongoUrl: MONGO,
        ttl: 3600
    }),
    secret: "CoderSecret",
    resave: false,
    saveUninitialized: false
}));

const io = new Server(httpServer);

app.engine("handlebars", engine());//handlebars como template engine para las vistas html
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/views`);

app.use(express.static(`${__dirname}/public`));//Para poder usar los archivos estáticos de la carpeta public (css y js)

app.use("/", viewRouter)
app.use("/api/sessions", sessionRouter)
app.use("/api/products", MongoProductRouter)
app.use("/api/carts", MongoCartRouter)
inicializePassport()
app.use(passport.initialize());
app.use(passport.session());


const mongoMessageManager = new MongoMessageManager();

io.on("connection", (socket) => {
    console.log("Cliente conectado");
    
    socket.on('createProduct', async (productData) => {
        try {
            console.log('Datos del producto recibidos en el servidor:', productData);
            const newProduct = new productModel(productData);
            await newProduct.save();
            io.emit('newProduct', productData);
        } catch (error) {
            console.error('Error al agregar producto:', error.message);
        }
    });
    socket.on("chat-message", async (data)=>{
        messages.push(data);
        io.emit("messages", messages);
        try {
            await mongoMessageManager.createMessage(data.email, data.message);
        } catch (error) {
            console.error('Error al guardar el mensaje en la base de datos:', error.message);
        }
    })

    socket.on("new-user", async (email)=>{
        socket.broadcast.emit("new-user", email);
        try {
            const messages = await mongoMessageManager.getMessages();
            socket.emit("messages", messages);
        } catch (error) {
            console.error('Error al obtener los mensajes de la base de datos:', error.message);
        }
    })
});
