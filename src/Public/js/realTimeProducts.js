const socket = io();

  socket.on('product-list', (products) => {
    const finalContent = document.getElementById('productsContainer');
    finalContent.innerHTML = '';
    products.forEach(product => {
      const productElement = document.createElement('li');
      productElement.innerHTML = `
        <h3>${product.title}</h3>
        <p>Descripción:${product.description}</p>
        <p>Precio: ${product.price}</p>
      `;
      finalContent.appendChild(productElement);
    });
  });

  socket.on('product-deleted', (productId) => {
    const productElement = document.getElementById(`product-${productId}`);
    if (productElement) {
      productElement.remove();
    }
  });
