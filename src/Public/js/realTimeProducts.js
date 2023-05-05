const socket = io();

socket.on('products', data =>{
    const finalContent = document.getElementById('productsContainer');
    let content = '';
    data.forEach(product => {
        content+=`${product.title} --- ${product.price}`
    })
    finalContent.innerHTML = content;
})