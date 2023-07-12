const express = require('express');
const router = express.Router();
const home = require('../controllers/index');


router.get('/', home.home);


module.exports = router;
