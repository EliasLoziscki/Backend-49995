import productModel from "../models/products.model.js";

class dbProductManager {
  async getProducts() {
    try {
      const products = await productModel.find();
      return products;
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  async createProduct(product) {
    try {
      const newProduct = new productModel(product);
      await newProduct.save();
      return "Producto Agregado ";
    } catch (error) {
      console.error("Error adding product:", error.message);
      return "Error al agregar producto";
    }
  }

  async getProductById(productId) {
    try {
      const product = await productModel.findById(productId);
      return product;
    } catch (error) {
      console.error("Error getting product:", error.message);
      return null;
    }
  }

  async updateProduct(id, updateProduct) {
    try {
      const product = await productModel.findByIdAndUpdate(id, updateProduct, {
        new: true,
      });
      return product
        ? "Producto actualizado correctamente."
        : "Product not found";
    } catch (error) {
      console.error("Error updating product:", error.message);
      return error;
    }
  }

  async deleteProduct(productId) {
    try {
      const product = await productModel.findByIdAndDelete(productId);
      return product
        ? "Eliminación del producto exitosamente."
        : "Product not found";
    } catch (err) {
      console.error("Error deleting product:", err.message);
      return err;
    }
  }
}

export default dbProductManager;
