import cartModel from "../models/carts.model.js";
import productModel from "../models/products.model.js";

class dbCartManager {
  getCarts = async () => {
    const carts = await cartModel.find();
    return carts;
  };

  getCartByID = (cid) => {
    return cartModel.findById(cid);
  };

  createCart = async () => {
    const cart = new cartModel({ products: [] });
    await cart.save();
    return cart;
  };

  addProductToCart = async (cid, pid, quantity = 1) => {
    const cart = await cartModel.findOne({ _id: cid });
    if (!cart) {
      return {
        status: "error",
        msg: `El carrito con el id ${cid} no existe`,
      };
    }
    const product = await productModel.findOne({ _id: pid });
    if (!product) {
      return {
        status: "error",
        msg: `El producto con el id ${pid} no existe`,
      };
    }

    let productsInCart = cart.products;

    const indexProduct = productsInCart.findIndex(
      (product) => product.product == pid
    );

    if (indexProduct == -1) {
      const newProduct = {
        product: pid,
        quantity: quantity,
      };
      cart.products.push(newProduct);
    } else {
      cart.products[indexProduct].quantity += quantity;
    }

    await cart.save();

    return cart;
  };

  deleteCart = async (cid) => {
    //La ruta elimina el carrito con el parámetro cid proporcionado
    const cart = await cartModel.findOne({ _id: cid });
    if (!cart) {
      return {
        status: "error",
        msg: `El carrito con el id ${cid} no existe`,
      };
    }
    await cartModel.deleteOne({ _id: cid });
    return {
      status: "success",
      msg: `El carrito con el id ${cid} fue eliminado`,
    };
  };

  deleteProductItCart = async (cid, pid) => {
    //La ruta elimina el producto con el parámetro pid del carrito con el parámetro cid proporcionado
    const cart = await cartModel.findOne({ _id: cid });
    if (!cart) {
      return {
        status: "error",
        msg: `El carrito con el id ${cid} no existe`,
      };
    }
    const product = await productModel.findOne({ _id: pid });
    if (!product) {
      return {
        status: "error",
        msg: `El producto con el id ${pid} no existe`,
      };
    }

    let productsInCart = cart.products;

    const indexProduct = productsInCart.findIndex(
      (product) => product.product == pid
    );

    if (indexProduct == -1) {
      return {
        status: "error",
        msg: `El producto con el id ${pid} no existe en el carrito con el id ${cid}`,
      };
    } else {
      cart.products.splice(indexProduct, 1);
    }

    await cart.save();

    return cart;
  };

  updateCart = async (cid, updateData) => {
    try {
      const cart = await cartModel.findOne({ _id: cid });

      if (!cart) {
        return {
          status: "error",
          msg: `El carrito con el id ${cid} no existe`,
        };
      }
      for (let key in updateData) {
        cart[key] = updateData[key];
      }

      await cart.save();

      return cart;
    } catch (error) {
      return {
        status: "error",
        msg: error.message,
      };
    }
  };

  async updateProductInCart(cid, pid, updateData) {
    // Obtén el carrito por cid
    const cartArray = await this.getCartByID({ _id: cid });
    if (!cartArray || cartArray.length === 0) {
      throw new Error(`No se encontró el carrito con ID: ${cid}`);
    }
    const cart = cartArray[0];
    console.log(cart);
    // Encuentra el producto en el carrito
    const productIndex = cart.products.findIndex(
      (product) => product.product._id.toString() === pid.toString()
    );
    console.log(productIndex);
    if (productIndex === -1) {
      throw new Error(
        `No se encontró el producto con ID: ${pid} en el carrito`
      );
    }

    // Actualiza el producto en el carrito
    cart.products[productIndex].quantity = updateData.quantity;

    // Guarda el carrito actualizado
    const updatedCart = await cart.save();
    console.log(updatedCart);

    return updatedCart;
  }
}

export default dbCartManager;
