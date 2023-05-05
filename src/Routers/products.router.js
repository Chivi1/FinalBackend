import express  from 'express';
import { Router } from "express";

import ProductManager from '../Managers/ProductManager.js';
const router = Router();
const app = express();
app.use(express.json());

const productManager = new ProductManager('./products.json');
//mostrar products en products.json
router.get('/', async (req, res) => {
    const limit = parseInt(req.query.limit);
    const products = await productManager.getProducts();
    const limitedProducts = isNaN(limit) ? products : products.slice(0, limit);
    res.json(limitedProducts);
    });
    
    //addproduct con postman
    router.post('/', async (req, res) => {
      try {
        const productPostman = req.body;
        console.log(productPostman);
        const result = await productManager.addProduct(productPostman);
        const productsUpdated = await productManager.getProducts();
        req.io.emit(productsUpdated)
        res.status(201).send("ok", {status: 'success', payload: result});
      } catch (error) {
        console.error(error);
        res.status(500).send("Error adding product");
      }
    });
    
    //mostrar product por id
    router.get('/:pid', async (req, res) => {
      const productId =  parseInt(req.params.pid);
      try {
        const product = await productManager.getProductById(productId);
        res.json(product);
      } catch (error) {
        res.status(404).send('Product not found');
      }
    });
    
    //actualizar un product 
    router.put('/:id', (req, res) => {
      const productId = req.params.id;
      const updatedProduct = req.body;
      productManager.updateProduct(productId, updatedProduct)
        .then((result) => {
          res.status(200).send(`El producto con id ${productId} ha sido actualizado`);
        })
        .catch((error) => {
          console.error(`Ocurrió un error al actualizar el producto con id ${productId}: ${error}`);
          res.status(500).send('Ocurrió un error al actualizar el producto');
        });
    });
    
    //borrar producto por id
    router.delete('/:id', (req, res) => {
      const productId = req.params.id;
      productManager.deleteProduct(productId)
        .then((res) => {
          res.status(200).send(`El producto con id ${productId} ha sido eliminado`);
        })
        .catch((error) => {
          console.error(`Ocurrió un error al eliminar el producto con id ${productId}: ${error}`);
          res.status(500).send('Ocurrió un error al eliminar el producto');
        });
    });
    
export default router;

//Crear producto

/* const newProduct = {
    title: 'Gorra negra',
    description: 'Esto es una gorra negra',
    price: 3000,
    thumbnail: 'ruta/imagen.jpg',
    code: 'ADBC5a225',
    stock: 100,
    status: true,
    category: 'gorras'
};
productManager.addProduct(newProduct);  */