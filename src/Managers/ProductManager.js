import fs from 'fs/promises';

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
    this.loadProducts();
  }

  async loadProducts() {
    try {
      const data = await fs.readFile(this.path);
      this.products = JSON.parse(data);
    } catch (err) {
      console.error(`Error al cargar productos desde archivo ${this.path}: ${err}`);
    }
  }
  
  async saveProducts() {
    try {
      await fs.writeFile(this.path, JSON.stringify(this.products));
      console.log(`Productos guardados en archivo ${this.path}.`);
    } catch (err) {
      console.error(`Error al guardar productos en archivo ${this.path}: ${err}`);
    }
  }
  

  async addProduct(product) {
    const { title, description, price, thumbnail, code, stock } = product;
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.error('Todos los campos son obligatorios');
      return;
    }
    if (this.getProductByCode(code)) {
      console.error('El código del producto ya existe');
      return;
    }
    const newProduct = { id: this.products.length + 1, ...product };
    this.products.push(newProduct);
    await this.saveProducts();
    console.log(`El producto ${newProduct.title} ha sido agregado con éxito.`);
  
    // Emitir evento con la lista actualizada de productos
    this.emitUpdatedProducts();
  }
  
  async getProducts() {
    try {
      const file = await fs.readFile(this.path);
      return JSON.parse(file.toString());
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getProductById(id) {
    const product = this.products.find(p => p.id === id);
    if (!product) {
      throw new Error(`No se encontró ningún producto con id ${id}`);
    }
    return product;
  }

  getProductByCode(code) {
    return this.products.find(p => p.code === code);
  }

  async updateProduct(id, productData) {
    const productIndex = this.products.findIndex(p => p.id === id);
    if (productIndex !== -1) {
      Object.assign(this.products[productIndex], productData);
      await this.saveProducts();
      console.log(`Producto con ID ${id} actualizado.`);
    } else {
      console.log(`Producto con ID ${id} no encontrado.`);
    }
  
    // Emitir evento con la lista actualizada de productos
    this.emitUpdatedProducts();
  }
  

  async deleteProduct(id) {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) {
      console.error('Producto no encontrado');
      throw new Error('Producto no encontrado');
    }
    this.products.splice(index, 1);
    await this.saveProducts();
    console.log(`El producto con id ${id} ha sido eliminado con éxito.`);
  
    // Emitir evento con la lista actualizada de productos
    this.emitUpdatedProducts();
  }

  emitUpdatedProducts() {
    this.getProducts().then(updatedProducts => {
      req.io.emit('products', updatedProducts);
    }).catch(error => {
      console.error(`Error al obtener la lista actualizada de productos: ${error}`);
    });
  }
}

export default ProductManager;



//Ejemplo de uso

/* const productManager = new ProductManager('./products.json'); */

//Crear producto
/* const newProduct = {
    title: 'Nuevo producto',
    description: 'Descripción del nuevo producto',
    price: 300,
    thumbnail: 'ruta/imagen.jpg',
    code: 'ADBC525',
    stock: 100
};
productManager.addProduct(newProduct);   */