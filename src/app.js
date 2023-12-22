import express from "express";
import mongoose from "mongoose";
import { engine } from "express-handlebars";
import viewRouter from "./routes/views.routes.js";
import __dirname from "./utils.js"; 
import { Server } from "socket.io";
import { cartRouter } from './routes/carts.routes.js';
import { productRouter } from './routes/products.routes.js';
import { messageRouter } from './routes/messages.routes.js';
import { ProductManagerFile } from './dao/managers/ProductManagerFile.js';
import { MongoCartManager } from "./dao/mongoManagers/MongoCartManager.js";
import { MongoProductManager } from "./dao/mongoManagers/MongoProductManager.js";

const PORT = 8080;
const app = express();

const MONGO = "mongodb+srv://waloz87:ASVmPWp4oZdPUTc2@cluster0.tul15f7.mongodb.net/ecommerce"
const connection = mongoose.connect(MONGO)

app.use(express.json()) 
app.use(express.urlencoded({extended:true})) 

const httpServer = app.listen(PORT, ()=> console.log(`Servidor funcionando en el puerto: ${PORT}`)); //Se crea el servidor http con express y se lo asigna a una constante para poder usarlo en el socket server

const io = new Server(httpServer);

app.engine("handlebars", engine());//handlebars como template engine para las vistas html
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/views`);

app.use(express.static(`${__dirname}/public`));//Para poder usar los archivos estáticos de la carpeta public (css y js)

app.use("/", viewRouter)
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use("/realtimeproducts", viewRouter)
app.use("/chat", messageRouter)

io.on("connection", (socket) => {
    console.log("Cliente conectado");

    socket.on('addProduct', async (productData) => {//Recibe los datos del producto desde el cliente y los agrega al archivo json
        try {
            console.log('Datos del producto recibidos en el servidor:', productData);
            
            const productManagerFile = new ProductManagerFile('products.json');
            await productManagerFile.initializeId();
            await productManagerFile.addProduct(productData.title, productData.description, productData.price, productData.thumbnail, productData.code, productData.stock, productData.status, productData.category);
    
            io.emit('newProduct', productData);
        } catch (error) {
            console.error('Error al agregar producto:', error.message);
        }
    });
    socket.on('chat message', (msg) => {
        console.log('Mensaje recibido:', msg);
        io.emit('chat message', msg);
    });
});
