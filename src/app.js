import express from 'express';
import handlebars from 'express-handlebars';
import {Server} from 'socket.io';

import viewsRouter from './Routers/viewsRouter.js';
import productsRouter from "./Routers/products.router.js"
import cartRouter from "./Routers/carts.router.js"

import __dirname from './utils.js';


const app = express();
const PORT = process.env.PORT||8080;
const server = app.listen(PORT,()=>console.log( `'Listening on ${PORT}'`))
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(`${__dirname}/public/js`));

app.use((req,res,next)=>{
    req.io = io;
    next();
});

//handlebars engine
app.engine('handlebars',handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use('/', viewsRouter)
app.use('/api/products', productsRouter)
app.use('/api/cart', cartRouter) 

io.on('connection', (socket) => {
    console.log('socket connectado');
});


