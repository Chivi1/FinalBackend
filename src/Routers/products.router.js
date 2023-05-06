import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager("./products.json");

// Mostrar todos los productos
router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const products = await productManager.getProducts();
    const limitedProducts = isNaN(limit) ? products : products.slice(0, limit);
    res.json(limitedProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los productos." });
  }
});

// Agregar un nuevo producto
router.post("/", async (req, res) => {
  try {
    const product = req.body;
    await productManager.addProduct(product);
    res.status(201).json({ message: "Producto agregado con éxito." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al agregar el producto." });
  }
});

// Mostrar un producto por su ID
router.get("/:id", async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const product = await productManager.getProductById(productId);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Producto no encontrado." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el producto." });
  }
});

// Actualizar un producto por su ID
router.put("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const updatedProduct = req.body;
    await productManager.updateProduct(productId, updatedProduct);
    res.json({ message: `El producto con ID ${productId} ha sido actualizado.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el producto." });
  }
});

// Eliminar un producto por su ID
router.delete("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    await productManager.deleteProduct(productId);
    res.json({ message: `El producto con ID ${productId} ha sido eliminado.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el producto." });
  }
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

/* router.post('/', async (req, res) => {
  try {
    const productPostman = req.body;
    console.log(productPostman);
    const result = await productManager.addProduct(productPostman);
        const productsUpdated = await productManager.getProducts();
    req.io.emit('productsUpdated', productsUpdated);
    console.log('Productos actualizados:', productsUpdated); // mensaje de registro
    res.status(201).send("ok", {status: 'success', payload: result});
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding product");
  }
}); */