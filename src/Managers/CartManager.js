import { readFile, writeFile } from 'fs/promises';
import path from 'path';

let cartIdCounter = 1;

async function createCart(cartPostman, response) {
  try {
    const carts = JSON.parse(await readFile('carts.json'));

    const newCart = {
      id: cartIdCounter++,
      cartPostman,
      products: []
    };

    carts.push(newCart);

    await writeFile('carts.json', JSON.stringify(carts));

    response.status(201).json(newCart);
  } catch (err) {
    console.error(err);
    response.sendStatus(500);
  }
}

async function getCartById(id) {
  try {
    const carts = await readCartsFile();

    const cart = carts.find((c) => c.id === id);
    return cart;
  } catch (error) {
    console.error(error);
    throw new Error('Error while getting the cart.');
  }
}

async function readCartsFile() {
  try {
    const cartsBuffer = await readFile(path.join(process.cwd(), 'carts.json'));
    const carts = JSON.parse(cartsBuffer.toString());
    return carts;
  } catch (error) {
    console.error(error);
    throw new Error('Error while reading carts file.');
  }
}

async function addToCart(cartId, productId) {
  try {
    // Leer el archivo de carts
    const cartsBuffer = await readFile(path.join(process.cwd(),'carts.json'));
    const carts = JSON.parse(cartsBuffer.toString());

    // Buscar el carrito correspondiente al ID proporcionado
    const cart = carts.find((c) => c.id === cartId);

    if (!cart) {
      throw new Error('Cart not found.');
    }

    // Leer el archivo de products
    const productsBuffer = await readFile(path.join(process.cwd(),'products.json'));
    const products = JSON.parse(productsBuffer.toString());

    // Buscar el producto correspondiente al ID proporcionado
    const product = products.find((p) => p.id === productId);

    if (!product) {
      throw new Error('Product not found.');
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

    return cart;
  } catch (error) {
    console.error(error);
    throw new Error('Error while adding product to cart.');
  }
}

const CartManager = {
  createCart,
  getCartById,
  readCartsFile,
  addToCart
};

export default CartManager;


