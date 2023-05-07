import { Router } from "express";
import ProductManager from "../managers/ProductManager";

const router = Router();

app.get('/products', async (req, res) => {
    try {
      const productManager = new ProductManager('./products.json');
      const products = await productManager.getProducts();
      res.render('realtimeproducts', { products });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener los productos.' });
    }
  });

  app.get('/', async (req, res) => {
    try {
      const productManager = new ProductManager('./products.json');
      const products = await productManager.getProducts();
      res.render('home', { products });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener los productos.' });
    }
  });


export default router;