const socketClient = io();

document.addEventListener('DOMContentLoaded', () => {
    const addProductForm = document.getElementById('addProductForm');
    const titleInput = document.getElementById('title');
    const priceInput = document.getElementById('price');
    const stockInput = document.getElementById('stock');
    const descriptionInput = document.getElementById('description');
    const thumbnailInput = document.getElementById('thumbnail');
    const codeInput = document.getElementById('code');
    const statusInput = document.getElementById('status');
    const categoryInput = document.getElementById('category');
    const productList = document.getElementById('products-list');
  
    const submitProductForm = (event) => {
        event.preventDefault();

        const title = titleInput.value;
        const price = priceInput.value;
        const stock = stockInput.value;
        const description = descriptionInput.value;
        const thumbnail = thumbnailInput.value;
        const code = codeInput.value;
        const status = statusInput.value;
        const category = categoryInput.value;
  
        socketClient.emit('addProduct', { title, price, stock, description, thumbnail, code, status, category }); 
        addProductForm.reset();
    };

    addProductForm.addEventListener('submit', submitProductForm);

    socketClient.on('newProduct', (productData) => {
        console.log('Nuevo producto agregado en tiempo real:', productData);
        const listItem = document.createElement('li');
        listItem.textContent += `${productData.title} - $${productData.price} - Stock: ${productData.stock} - Code: ${productData.code}`;
        productList.appendChild(listItem);
    });
});
