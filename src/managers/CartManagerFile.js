import fs from "fs";
import path from "path";
import __dirname from "../utils.js";

class CartManagerFile {
  constructor(pathFile) {
    this.path = path.join(__dirname, `/files/${pathFile}`);
  }

  async getCart() {//Obtiene todos los carritos del archivo carts.json
    try {
      if (fs.existsSync(this.path)) {
        const carts = JSON.parse(
          await fs.promises.readFile(this.path, "utf-8")
        );
        return carts;
      } else {
        console.error(`El archivo ${this.path} no existe.`);
        return []; 
      }
    } catch (err) {
      console.error(err);
      return []; // Devolver un array vacío en caso de error
    }
  }

  async createCart() {//Crea un carrito vacío y lo agrega al archivo carts.json 
    try {
      const carts = await this.getCart();
      const lastCart = carts[carts.length - 1];
      const lastCartId = lastCart ? lastCart.id : 0;
      const newCart = { id: lastCartId + 1, products: [] };
      carts.push(newCart);

      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));

      return newCart;
    } catch (error) {
      console.error("Error al crear el carrito:", error);
    }
  }

  async getCartProducts(cid) {//La ruta lista los productos que pertenezcan al carrito con el parámetro cid proporcionado
    try {
      const carts = await fs.promises.readFile(this.path, "utf-8");
      const cartData = JSON.parse(carts);
      const cart = cartData.find((cart) => Number(cart.id) === Number(cid));
      if (cart) {
        return cart.products;
      } else {
        console.error("Carrito no encontrado");
        return [];
      }
    } catch (error) {
      console.error("Error al obtener los productos del carrito:", error);
      return [];
    }
  }

  async addProductToCart(cid, pid, quantity) {//esta ruta deberá agregar el producto al arreglo "products" del carrito seleccionado, agregándose como un objeto
    try {
      const carts = await this.getCart();
      const cart = carts.find((cart) => Number(cart.id) === Number(cid));
      const existingProduct = cart.products.find(
        (product) => product.id === pid
      );
      if (existingProduct) {
        existingProduct.quantity++;
      } else {
        cart.products.push({
          id: pid,
          quantity: 1,
        });
      }
      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
      return cart;
    } catch (error) {
      console.error("Error al agregar el producto al carrito:", error);
      return [];
    }
  }
}

export { CartManagerFile };
