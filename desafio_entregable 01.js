
class ProductManager{

    constructor (){
        this.products = [];
    }

    addProduct = (title,description,price,thumbnail,code,stock) => {

        let cantProducts = this.products.length;

        if(!title || !description || !price || !thumbnail || !code || !stock){
            return 'Todos los datos son requeridos'
        }

        if (this.products.some(product => product.code === code)) {
            return console.log('El producto esta repetido')
        }

        const product = {
            title: 'producto prueba',
            description:'Este es un producto prueba',
            price: 200,
            thumbnail: 'Sin imagen',
            code: 'abc123',
            stock: 25,
            id: ++cantProducts
        }

        this.products.push(product);
    }

    getProducts = () => {
        return this.products;
    }

    getProductById = (idProduct) => {
        const product = this.products.find(product => product.id === idProduct);

        if(product){
            return product;
        }else{
            return 'Not found'
        }
    }
}

const productManager = new ProductManager();

console.log(productManager.getProducts()); //Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []

productManager.addProduct('producto prueba','Este es un producto prueba',200,'Sin imagen','abc123',25) //Se llamará al método “addProduct” con los campos:
console.log(productManager.getProducts()); //Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado

productManager.addProduct('producto prueba','Este es un producto prueba',200,'Sin imagen','abc123',25) //Se llamará al método “addProduct” con los mismos campos de arriba, debe arrojar un error porque el código estará repetido.
console.log(productManager.getProducts()); 

console.log(productManager.getProductById(1));
console.log(productManager.getProductById(2)); //Se evaluará que getProductById devuelva error si no encuentra el producto o el producto en caso de encontrarlo