import { Router } from "express";
import CartManager from '../Managers/CartManager.js';


const router = Router();

router.post('/', async (req, res) => {
  try {
    await CartManager.createCart(req.body, res);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
  
    const cart = await CartManager.addToCart(cartId, productId);
  
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:cid', async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const cart = await CartManager.getCartById(cartId);

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
