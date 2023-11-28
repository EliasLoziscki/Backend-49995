import fs from "fs";
import path from "path";
import __dirname from "../utils.js";

class CartManagerFile {
    constructor(pathFile) {
        this.path = path.join(__dirname,`/files/${pathFile}`)
    }
}

export { CartManagerFile };
