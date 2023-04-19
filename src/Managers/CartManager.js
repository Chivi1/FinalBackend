import express from 'express';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';


const app = express();
const CartManager = express.Router();
let cartIdCounter = 1;

app.use(express.json());

//crear un nuevo carrito
app.post('/api/carts', async (req, res) => {
  try {
    // Leer el archivo de carts
    const carts = JSON.parse(await readFile('carts.json'));

    // Crear un nuevo carrito con un id autoincrementable
    const newCart = {
      id: cartIdCounter++,
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
app.post('/api/carts/:cid/product/:pid', async (req, res) => {
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

    // Buscar el carrito correspondiente al cid especificado
    app.get('api/carts/:cid', async (req, res) => {
        try {
          const cartId = parseInt(req.params.cid);
          const cart = await readCart(cartId);
      
          if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
          }
      
          res.json(cart);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal server error' });
        }
    });

    // Función para obtener un carrito por su ID
    async function getCarritoById(id) {
      try {
        // Leer el archivo "carrito.json"
        const carritos = JSON.parse(await fs.readFile(path.join(__dirname, 'carts.json')));
    
        // Buscar el carrito correspondiente al ID proporcionado
        const carrito = carritos.find((c) => c.id === id);
    
        // Devolver el carrito encontrado
        return carrito;
      } catch (error) {
        console.error(error);
        throw new Error('Hubo un error al obtener el carrito.');
      }
    }
    
export default CartManager

