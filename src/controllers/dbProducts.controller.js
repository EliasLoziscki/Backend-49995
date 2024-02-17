import dbProductManager from "../dao/mongoManagers/dbProductManager.js";

const productManager = new dbProductManager();


const getProductsAll = async (req, res) => {
    try {
        const product = await productManager.getProducts();
    
        res.send({
          status: "success",
          msg: "Productos del carrito",
          carts: product,
        });
      } catch (error) {
        console.error("que pasa", error);
        res.send({
          status: "error",
          msg: "Error al obtener los carts",
        });
      }
};

const postCreateProduct = async (req, res) => {
  const product = req.body;

  await productManager.createProduct(product);

  res.send({
    status: "success",
    msg: "Producto creado",
    producto: product,
  });
};

const ProductById = async (req, res) => {
  const pid = req.params.pid;
  try {
    const product = await productManager.getProductById(pid);
    res.send({
      status: "success",
      msg: `Ruta GET ID PRODUCTS con ID: ${pid}`,
      producto: product,
    });
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    res.send({
      status: "error",
      msg: "Error al obtener el producto",
    });
  }
};

const updateProductById = async (req, res) => {
  try {
    const pid = req.params.pid;
    const updatedProduct = req.body;
    await productManager.updateProduct(pid, updatedProduct);
    res.send({
      status: "success",
      msg: `Ruta PUT de PRODUCTS con ID: ${pid}`,
    });
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res.send({
      status: "error",
      msg: "Error al actualizar el producto",
    });
  }
};

const deleteProductById = async (req, res) => {
  try {
    const pid = req.params.pid;
    const product = await productManager.getProductById(pid);
    const productTitle = product.title;
    await productManager.deleteProduct(pid);
    res.send({
      status: "success",
      msg: `Ruta DELETE de PRODUCTS con ID: ${pid}`,
      producto: productTitle,
    });
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    res.send({
      status: "error",
      msg: "Error al eliminar el producto",
    });
  }
};

export { 
  getProductsAll,
  postCreateProduct,
  ProductById,
  updateProductById,
  deleteProductById
};