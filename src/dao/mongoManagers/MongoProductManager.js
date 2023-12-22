const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    title: { 
        type: String,
        required: true
    },
    description: {
        type: String, 
        required: true
    },
    price: {
        type: Number, 
        required: true
    },
    thumbnail: {
        type: String, 
        required: false
    },
    code: {
        type: String, 
        required: true
    },
    stock: {
        type: Number, 
        required: true
    },
    status: {
        type: String, 
        required: true
    },
    category: {
        type: String, 
        required: true
    }
});

const Product = mongoose.model('Product', ProductSchema);

class MongoProductManager {
    async getProducts() {
        try {
        const products = await Product.find();
        return products;
        } catch (err) {
        console.error(err);
        return [];
        }
    }

    async createProduct(product) {
        try {
        const newProduct = new Product(product);
        await newProduct.save();
        return "Producto Agregado ";
        } catch (error) {
        console.error("Error adding product:", error.message);
        return "Error al agregar producto";
        }
    }

    async getProductById(productId) {
        try {
        const product = await Product.findById(productId);
        return product;
        } catch (error) {
        console.error("Error getting product:", error.message);
        return null;
        }
    }

    async updateProduct(id, updateProduct) {
        try {
        const product = await Product.findByIdAndUpdate(id, updateProduct, { new: true });
        return product ? "Producto actualizado correctamente." : "Product not found";
        } catch (error) {
        console.error("Error updating product:", error.message);
        return error;
        }
    }

    async deleteProduct(productId) {
        try {
        const product = await Product.findByIdAndRemove(productId);
        return product ? "Eliminación del producto exitosamente." : "Product not found";
        } catch (err) {
        console.error("Error deleting product:", err.message);
        return err;
        }
    }
}

export { MongoProductManager };