import fs from "fs";
import path from "path";
import __dirname from "../utils.js";

class ProductManagerFile {
    constructor(pathFile) {
      this.path = path.join(__dirname,`/files/${pathFile}`);
    }

    initializeId = async () => {//inicializa el id del producto a crear
      try {
          let products = await this.readProducts();
          if (products.length > 0) {
              let maxId = Math.max(...products.map(product => product.id));
              this.id = maxId + 1;
          } else {
              this.id = 1;
          }
      } catch (error) {
          console.error("Error initializing ID:", error.message);
      }
  }

  addProduct = async(title, description, price, thumbnail, code, stock, status, category) => { //Agrega un producto al archivo json 
    try {
        if (typeof this.id === 'undefined') {
            await this.initializeId();
        }

        let products = await this.readProducts();

        let existingProduct = products.find(product => product.code === code);
        if (existingProduct) {
            console.log('Not found: Ya existe un producto con el mismo código');
            return;
        }

        let newProduct = {
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
          status,
          category,
          id: this.id++
        };

        products.push(newProduct);

        await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"));

        return "Producto Agregado ";
    } catch (error) {
        console.error("Error adding product:", error.message);
        return "Error al agregar producto";
    }
}

  readProducts = async () => {//lee el archivo json y devuelve un array de productos
    try {
        let data = await fs.promises.readFile(this.path, 'utf-8');
        let products = JSON.parse(data);

        return Array.isArray(products) ? products : [];
        
    } catch (error) {
        console.error("Error reading file:", error.message);
        return [];
    }
  }

  async getProducts() {//obtiene todos los productos del archivo json
    try {
        if (fs.existsSync(this.path)) {
            const products = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
            return products;
        } else {
            console.error(`El archivo ${this.path} no existe.`);
            return []; 
        }
    } catch (err) {
        console.error(err);
        return []; // Devolver un array vacío en caso de error
    }
}

async createProduct(product) { 
    if (!product.title || !product.description || !product.price || !product.code || !product.stock || !product.status || !product.category) {//valida que todos los datos del body de la petición post existan
      return "Todos los datos son requeridos"; //si alguno no existe devuelve este mensaje
    }

    const products = await this.getProducts();//obtiene todos los productos del archivo json 

    let existe = products.find((p) => p.code == product.code);//busca si el producto a crear ya existe por su código

    if (existe) {//si el producto ya existe devuelve Not Found
      return "Not found.";
    } else {
      if (products.length === 0) {
        product.id = 1;
      } else {
        product.id = products[products.length - 1].id + 1;//si el producto no existe le asigna un id al producto a crear
      }

      products.push(product);//agrega el producto al array de productos

      await fs.promises.writeFile(this.path,JSON.stringify(products, null, "\t"));

      return products;
    }
  }


async getProductById(productId) {//recibe el id del producto a buscar
    const products = await this.getProducts();

    let product = products.find((product) => product.id == productId);

    if (product) {
        return product;
    } else {
        return "El producto no existe.";
    }
}

async updateProduct(id, updateProduct) {//recibe el id del producto a actualizar y los datos del body de la petición put 
    try {
        const products = await this.getProducts();//obtiene todos los productos del archivo json

        const productoIndex = products.findIndex((prod) => prod.id == id);//busca el indice del producto a actualizar por id 

        if (productoIndex != -1) {//si el producto existe en el archivo json lo actualiza
            if (updateProduct.title) {
                products[productoIndex].title = updateProduct.title;
            }

            if (updateProduct.description) {
                products[productoIndex].description = updateProduct.description;
            }

            if (updateProduct.price) {
                products[productoIndex].price = updateProduct.price;
            }

            if (updateProduct.thumbnail) {
                products[productoIndex].thumbnail = updateProduct.thumbnail;
            }

            if (updateProduct.code) {
                products[productoIndex].code = updateProduct.code;
            }

            if (updateProduct.stock) {
                products[productoIndex].stock = updateProduct.stock;
            }

            if (updateProduct.status) {
                products[productoIndex].status = updateProduct.status;
            }

            if (updateProduct.category) {
                products[productoIndex].category = updateProduct.category;
            }

            await fs.promises.writeFile(
                this.path,
                JSON.stringify(products, null, "\t")
            );

            return "Producto actualizado correctamente.";
            
        } else {
            return "Product not found";
        }
    } catch (error) {
        return error;
    }
}

  async deleteProduct(productId) {//recibe el id del producto a eliminar
    try {
      const products = await this.getProducts();

      const productoIndex = products.findIndex((prod) => prod.id == productId);

      if (productoIndex != -1) {
        products.splice(productoIndex, 1);

        await fs.promises.writeFile(
          this.path,
          JSON.stringify(products, null, "\t")
        );

        return "Eliminación del producto exitosamente.";
      } else {
        return "Product not found";
      }
    } catch (err) {
      return err;
    }
  }
}

export {ProductManagerFile};