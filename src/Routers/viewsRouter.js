import { Router } from "express";

const router = Router();

router.get ('/',(req,res)=>{
    res.render('home');
});

router.get('/products',(req,res)=>{
    res.render('realTimeProducts')
    } );

export default router;