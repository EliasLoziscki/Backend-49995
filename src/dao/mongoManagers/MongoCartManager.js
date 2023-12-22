const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    products: Array
});

const Cart = mongoose.model('Cart', CartSchema);

class MongoCartManager {
    async getCart() {
        try {
        const carts = await Cart.find();
        return carts;
        } catch (err) {
        console.error(err);
        return [];
        }
    }

    async createCart() {
        try {
        const newCart = new Cart({ products: [] });
        await newCart.save();
        return newCart;
        } catch (error) {
        console.error("Error al crear el carrito:", error);
        }
    }

    async getCartProducts(cid) {
        try {
        const cart = await Cart.findById(cid);
        return cart ? cart.products : null;
        } catch (error) {
        console.error("Error al obtener los productos del carrito:", error);
        }
    }

    async addProductToCart(cid, pid, quantity) {
        try {
        const cart = await Cart.findById(cid);
        if (!cart) return null;
        cart.products.push({ productId: pid, quantity: quantity });
        await cart.save();
        return cart;
        } catch (error) {
        console.error("Error al agregar el producto al carrito:", error);
        }
    }
}

export { MongoCartManager }