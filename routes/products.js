const express = require('express');
const router = express.Router();
const { contenedor } = require('../app')

/* GET home page. */
router.get('/', async function (req, res, next) {
  products = await contenedor.getAll()
  res.json(products)
});

module.exports = router;
