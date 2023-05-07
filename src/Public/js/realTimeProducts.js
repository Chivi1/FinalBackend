const socket = io();

console.log(socket);

socket.on('new-product', (product) => {
  console.log("LLEGO")
    const finalContent = document.getElementById('productsContainer');
    let content = '';
    content += `${product.title} --- ${product.price}<br>`;
    finalContent.innerHTML += content;
  });
