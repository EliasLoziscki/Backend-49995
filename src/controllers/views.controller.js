import dbCartManager from "../dao/mongoManagers/dbCartManager.js";
import productModel from "../dao/models/products.model.js";
import dbMessageManager from "../dao/mongoManagers/dbMessageManager.js";

const cartManager = new dbCartManager();
const MessageManager = new dbMessageManager();

const home = async (req, res) => {
  try {
    const products = await productModel.find().lean();
    res.render("home", { products, style: "index" });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.send({
      status: "error",
      msg: "Error al obtener productos",
    });
  }
};

const realtimeproducts = async (req, res) => {
  try {
    const products = await productModel.find().lean();
    res.render("realtimeproducts", { products, style: "index" });
  } catch (error) {
    console.error("Error al obtener productos en tiempo real:", error);
    res.send({
      status: "error",
      msg: "Error al obtener productos en tiempo real",
    });
  }
};

const register = (req, res) => {
  res.render("register", { style: "index" });
};

const login = (req, res) => {
  res.render("login", { style: "index" });
};

const profile = (req, res) => {
  res.render("profile", { user: req.session.user, style: "index" });
};

const cartsCid = async (req, res) => {
  const cid = req.params.cid;
  try {
    const cart = await cartManager
      .getCartByID(cid)
      .populate("products.product")
      .lean();
    if (!cart) {
      throw new Error(`No se encontró el carrito con ID: ${cid}`);
    }

    res.render("cartId", { cart, style: "index" });
  } catch (error) {
    console.error("Error al obtener el cart:", error);
    res.send({
      status: "error",
      msg: `Error al obtener el cart con ID: ${cid}`,
    });
  }
};

const products = async (req, res) => {
  try {
    const { page = 1, category, sort, limit = 10 } = req.query;

    const query = category ? { category } : {};

    const options = {
      page,
      limit: Number(limit),
      lean: true,
      leanWithId: false,
    };
    if (sort) {
      options.sort = { price: sort === "desc" ? -1 : 1 };
    }

    const products = await productModel.paginate(query, options);
    res.render("products", {
      products: products,
      limit: limit,
      category: category,
      sort: sort,
      user: req.session.user,
      style: "index",
    });
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.send({
      status: "error",
      msg: "Error al obtener los productos",
    });
  }
};

const chat = async (req, res) => {
  const message = await MessageManager.getMessages();
  res.render("chat", { message });
};

const resetPassword = (req, res) => {
  res.render("resetPassword", { style: "index" });
};

export {
  home,
  realtimeproducts,
  register,
  login,
  profile,
  cartsCid,
  products,
  chat,
  resetPassword,
};
