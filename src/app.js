import express from 'express';
import ProductManager from './Managers/ProductManager.js';
import CartManager from './Managers/CartManager.js';

const app = express();
app.use(express.json());
const productManager = new ProductManager('./products.json');

app.get('/products', async (req, res) => {
  const limit = req.query.limit;
  const products = await productManager.getProducts();
  console.log(limit, products)
  const limitedProducts = limit ? products.slice(0, limit) : products;
  console.log(limitedProducts)
  res.json(limitedProducts);
});

app.get('/products/:pid', async (req, res) => {
  const productId =  parseInt(req.params.pid);
  try {
    const product = await productManager.getProductById(productId);
    res.json(product);
  } catch (error) {
    res.status(404).send('Product not found');
  }
});

// Ruta para obtener los productos de un carrito por su ID
app.get('api/cart/:cid/products', async (req, res) => {
  try {
    // Obtener el ID del carrito de la URL
    const { cid } = req.params;

    // Buscar el carrito correspondiente en el archivo "carrito.json"
    const carrito = await CartManager.getCarritoById(cid);

    // Devolver los productos del carrito
    res.json(carrito.products);
  } catch (error) {
    console.error(error);
    res.status(500).send('Hubo un error al obtener los productos del carrito.');
  }
});


app.listen(8080,()=>console.log('Listening on PORT 8080'));
