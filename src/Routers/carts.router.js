import express  from 'express';
import { Router } from "express";
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import fs from "fs";

const router = Router();
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const app = express();
app.use(express.json());

//crear un nuevo carrito
  let cartIdCounter = 1;
  router.post('/', async (req, res) => {
    try {
      const carts = JSON.parse(await readFile('carts.json'));
      const cartPostman = req.body;
      // Crear un nuevo carrito con un id autoincrementable
      const newCart = {
        id: cartIdCounter++,
        cartPostman,
        products: []
      };
  
      // Agregar el nuevo carrito al array de carts
      carts.push(newCart);
  
      // Escribir los carts actualizados en el archivo
      await writeFile('carts.json', JSON.stringify(carts));
  
      res.status(201).json(newCart);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  });
  
  // Endpoint para agregar un producto a un carrito
  router.post('/:cid/product/:pid', async (req, res) => {
    try {
      // Leer el archivo de carts
      const carts = JSON.parse(await readFile('carts.json'));

      // Buscar el carrito correspondiente al cid especificado
      const cart = carts.find((cart) => cart.id === parseInt(req.params.cid));
  
      if (!cart) {
        return res.sendStatus(404);
      }
  
      // Leer el archivo de products
      const products = JSON.parse(await readFile('products.json'));
  
      // Buscar el producto correspondiente al pid especificado
      const product = products.find((product) => product.id === parseInt(req.params.pid));
  
      if (!product) {
        return res.sendStatus(404);
      }
  
      // Buscar si el producto ya está en el carrito y actualizar la cantidad si es el caso
      const existingProduct = cart.products.find((item) => item.id === product.id);
  
      if (existingProduct) {
        existingProduct.quantity++;
      } else {
        // Agregar el producto al carrito con una cantidad de 1
        cart.products.push({
          id: product.id,
          quantity: 1
        });
      }
  
      // Escribir los carts actualizados en el archivo
      await writeFile('carts.json', JSON.stringify(carts));
  
      res.status(200).json(cart);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  });

/// Función para obtener un carrito por su ID
async function getCartById(id) {
  try {
    // Leer el archivo "carts.json"
    const cartsBuffer = await readFile(path.join(process.cwd(),'carts.json'));
    const carts = JSON.parse(cartsBuffer.toString());

    // Buscar el carrito correspondiente al ID proporcionado
    const cart = carts.find((c) => c.id === id);
    return cart;
  } catch (error) {
    console.error(error);
    throw new Error('Error while getting the cart.');
  }
}

// Ruta para obtener un carrito por su ID
router.get('/:cid', async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const cart = await getCartById(cartId);

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

  
/* // Ruta para obtener los productos de un carrito por su ID
router.get('/:cid/products', async (req, res) => {
  try {
  // Obtener el ID del carrito de la URL
  const { cid } = req.params;

  // Buscar el carrito correspondiente en el archivo "carrito.json"
  const cartFound = await getCartById(cid);

  // Devolver los productos del carrito
  res.json(cartFound.products);
} catch (error) {
  console.error(error);
  res.status(500).send('Hubo un error al obtener los productos del carrito.');
}
}); */



export default router;