const socket = io();

socket.on('new-product', products => {
  const productList = document.getElementById('product-list');
  productList.innerHTML = '';

  productArray.forEach(product => {
    const productElement = document.createElement('li');
    productElement.innerHTML = `
      <h3>${product.title}</h3>
      <p>${product.description}</p>
      <p>Precio: ${product.price} ${product.currency}</p>
    `;
    productList.appendChild(productElement);
  });
});

  