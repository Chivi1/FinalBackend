const socket = io();

console.log(socket);

socket.on('products', (data) => {
    const finalContent = document.getElementById('productsContainer');
    let content = '';
    data.forEach(product => {
      content += `${product.title} --- ${product.price}<br>`;
    });
    finalContent.innerHTML = content;
  });