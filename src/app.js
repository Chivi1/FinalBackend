import express from 'express';
import productsRouter from "./Routers/products.router.js"
import cartRouter from "./Routers/carts.router.js"

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use('/api/products', productsRouter)

app.use('/api/cart', cartRouter) 



app.listen(8080,()=>console.log('Listening on PORT 8080'));
