import { Router } from 'express';
import {CartManagerFile} from '../managers/CartManagerFile.js';

const path = 'carts.json';
const router = Router();
const cartManagerFile = new CartManagerFile(path);


export { router as cartRouter } // Exportar el router para usarlo en app.js
