import express  from 'express';
import { Router } from "express";
import fs from 'fs';

const router = Router();
const app = express();
app.use(express.json());

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
    this.loadProducts();
  }

  async loadProducts() {
    try {
      const data = await fs.promises.readFile(this.path);
      this.products = JSON.parse(data);
    } catch (err) {
      this.products = [];
      console.error(`Error al cargar productos desde archivo ${this.path}: ${err}`);
    }
  }
  
  async saveProducts() {
    try {
      const data = JSON.stringify(this.products);
      await fs.promises.writeFile('./products.json', data);
      console.log(`Productos guardados en archivo ${this.path}.`);
    } catch (err) {
      console.error(`Error al guardar productos en archivo ${this.path}: ${err}`);
    }
  }
  

  async addProduct(product) {
    const { title, description, price, code, stock, category, status=true } = product;
if (!title || !description || !price || !code || !stock || !category) {
  console.error('Todos los campos son obligatorios');
      return;
    }
    if (this.getProductByCode(code)) {
      console.error('El código del producto ya existe');
      return;
    }
    const id = this.products.length + 1;
    const newProduct = { id, ...product };
    this.products.push(newProduct);
    await this.saveProducts();
    console.log(`El producto ${newProduct.title} ha sido agregado con éxito.`);
  }
  

  async getProducts() {
    try {
      const file = await fs.promises.readFile(this.path);
      return JSON.parse(file.toString());
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const products = await this.getProducts();

      const product = products.find((p) => p.id === id);

      if (!product) {
        throw new Error(`No se encontró ningún producto con id ${id}`);
      }

      return product;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  getProductByCode(code) {
    const product = this.products.find(p => p.code === code);
    return product;
  }

  async updateProduct(id, productData) {
    try {
      const productIndex = this.products.findIndex(p => p.id === id);
      ;
      if (productIndex !== -1) {
        // Copia el objeto
        const productToUpdate = Object.assign({}, this.products[productIndex]);
  
        // Actualiza solo las propiedades que se reciben en el objeto productData
        Object.assign(productToUpdate, productData);
  
        this.products[productIndex] = productToUpdate;
        await this.saveProducts();
        console.log(`Producto con ID ${id} actualizado.`);
      } else {
        console.log(`Producto con ID ${id} no encontrado.`);
      }
    } catch (error) {
      console.log(`Error al actualizar el producto con ID ${id}: ${error}`);
    }
  }
  

  deleteProduct(id) {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) {
      console.error('Producto no encontrado');
      return;
    }
    this.products.splice(index, 1);
    this.saveProducts();
    console.log(`El producto con id ${id} ha sido eliminado con éxito.`);
  }
}
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
        await productManager.addProduct(productPostman);
        res.send("ok");
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