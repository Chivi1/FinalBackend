import { Router } from "express";
import ProductManager from "../Managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager('./products.json');

router.get('/products', async (req, res) => {
    try {
      const products = await productManager.getProducts();
      res.render('realtimeproducts', { products });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener los productos.' });
    }
  });

  router.get('/', async (req, res) => {
    try {
      const products = await productManager.getProducts();
      res.render('home', { products });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener los productos.' });
    }
  });


export default router;