import dbCartManager from "../dao/mongoManagers/dbCartManager.js";

let cartManager = new dbCartManager();

const postCreateCarts = async (req, res) => {
    try {
        const cart = await cartManager.createCart();
        res.send({
          status: "success",
          msg: "Cart creado",
          producto: cart,
        });
      } catch (error) {
        console.error("Error al crear el cart:", error);
        res.send({
          status: "error",
          msg: "Error al crear el cart",
        });
      }
};

const getCartsAll = async (req, res) => {
    try {
        const carts = await cartManager.getCarts();
    
        res.send({
          status: "success",
          msg: "Productos del carrito",
          carts: carts,
        });
      } catch (error) {
        console.error("Error al obtener los carts:", error);
        res.send({
          status: "error",
          msg: "Error al obtener los carts",
        });
      }
};

const cartByID = async (req, res) => {
    try {
        const cid = req.params.cid;
        const cart = await cartManager.getCartByID({ _id: cid });
        res.send({
          status: "success",
          msg: `Ruta GET ID CART con ID: ${cid}`,
          producto: cart,
        });
      } catch (error) {
        console.error("Error al obtener el cart:", error);
        res.send({
          status: "error",
          msg: `Error al obtener el cart con ID: ${cid}`,
        });
      }
};

const postAddProductToCart = async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const quantity = req.body.quantity;
        const cart = await cartManager.addProductToCart(cid, pid, quantity);
        res.send({
          status: "success",
          msg: `Ruta POST ID CART con ID: ${cid} y ID PRODUCTO con ID: ${pid}`,
          producto: cart,
        });
      } catch (error) {
        console.error("Error al agregar el producto al carrito:", error);
        res.send({
          status: "error",
          msg: "Error al agregar el producto al carrito",
        });
      }
};

const updateCartId = async (req, res) => {
    try {
        const cid = req.params.cid;
        const updateData = req.body;
        const cart = await cartManager.updateCart(cid, updateData);
        res.send({
          status: "success",
          msg: `Ruta PUT ID CART con ID: ${cid}`,
          producto: cart,
        });
      } catch (error) {
        console.error("Error al actualizar el cart:", error);
        res.send({
          status: "error",
          msg: `Error al actualizar el cart con ID: ${cid}`,
        });
      }
};

const updateCartIdByProduct = async (req, res) => {
    const cid = req.params.cid;
  const pid = req.params.pid;
  const updateData = req.body;
  try {
    const cart = await cartManager.updateProductInCart(cid, pid, updateData);
    res.send({
      status: "success",
      msg: `Ruta PUT ID CART con ID: ${cid} y ID PRODUCTO con ID: ${pid}`,
      producto: cart,
    });
  } catch (error) {
    console.error("Error al actualizar el cart:", error);
    res.send({
      status: "error",
      msg: `Error al actualizar el cart con ID: ${cid} y el producto con ID: ${pid}`,
    });
  }
};

const deleteCartById = async (req, res) => {
    const cid = req.params.cid;
  try {
    const cart = await cartManager.deleteCart({ _id: cid });
    res.send({
      status: "success",
      msg: `Ruta DELETE ID CART con ID: ${cid}`,
      producto: cart,
    });
  } catch (error) {
    console.error("Error al eliminar el cart:", error);
    res.send({
      status: "error",
      msg: `Error al eliminar el cart con ID: ${cid}`,
    });
  }
};

const deleteProductItCartById = async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
    
        const cart = await cartManager.deleteProductItCart(cid, pid);
    
        res.send({
          status: "success",
          msg: `Ruta DELETE ID CART con ID: ${cid}`,
          producto: cart,
        });
      } catch (error) {
        console.error("Error al eliminar el cart:", error);
        res.send({
          status: "error",
          msg: `Error al eliminar el cart con ID: ${cid}`,
        });
      }
};

export { 
    postCreateCarts,
    getCartsAll,
    cartByID,
    postAddProductToCart,
    updateCartId,
    updateCartIdByProduct,
    deleteCartById,
    deleteProductItCartById
};