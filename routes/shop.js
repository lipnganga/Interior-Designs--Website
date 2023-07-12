const express = require('express');
const shopcontroller = require('../controllers/shop');
const router = express.Router();

router.get('/', shopcontroller.getAllProducts);

router.get('/products:proId', shopcontroller.getProductDetail);


module.export = router;