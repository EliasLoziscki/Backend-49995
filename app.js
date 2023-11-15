import ProductManager from './ProductManager.js';

const productManager = new ProductManager('./files/productos.json');

const env = async () => {

    
    let productos = await productManager.getProducts();

    console.log( "Listado de Productos: ", productos );

    

    let producto = {
        title: 'producto prueba',
        description: 'Este es un producto de prueba',
        price: 200,
        thumbnail: 'Sin Imagen',
        code: 'abc123',
        stock: 25
    }

    let resultado = await productManager.addProduct(producto);

    console.log( "Producto: ", resultado );


    //Se llamará al método “getProductById” y se corroborará que devuelva el producto con el id especificado, en caso de no existir, debe arrojar un error.
    console.log( "Producto by Id: ", await productManager.getProductById(12) );

    console.log( "Producto by Id: ", await productManager.getProductById(1) );

    //Borrar Producto

    console.log( await productManager.deleteProduct(1) );

    let updateProducto = {
        price: 500,
    }

    console.log( await productManager.updateProduct( 2, updateProducto ) );
}

env();