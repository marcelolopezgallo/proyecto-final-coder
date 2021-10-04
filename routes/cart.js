const express = require('express');
const router = express.Router();
const Contenedor = require( '../models/contenedor')

const contenedor_carritos = new Contenedor('./db/carritos.txt')
const contenedor_productos = new Contenedor('./db/productos.txt')
const ADMIN = true

function getAuth(req, res, next) {
  if (ADMIN) next()
  else throw Error('método no permitido')
}

router.get('/:cartId/products', async function (req, res, next) {
  try {
    const cart = await contenedor_carritos.getById(req.params.cartId)
    res.json(cart)
  } catch (error) {
    next(error)
  }
})

router.post('/', getAuth, async function (req, res, next) {
  try {
    cartData = req.body
    const createdCart = await contenedor_carritos.create(cartData)
    res.status(201).json(createdCart)
  } catch (error) {
    next(error)
  }
})

router.post('/:cartId/products', getAuth, async function (req, res, next) {
  try {
    const productId = req.body.pid
    const productData = await contenedor_productos.getById(productId)
    const id = await contenedor_carritos.addCartProduct(req.params.cartId, productData)
    const cartData = await contenedor_carritos.getById(req.params.cartId)
    res.status(200).json(cartData)
  } catch (error) {
    next(error)
  }
})

router.delete('/:cartId/products/:pid', getAuth, async function (req, res, next) {
  try {
    const id = await contenedor_carritos.deleteCartProductById(req.params.cartId, req.params.pid)
    res.status(200).json(id)
  } catch (error) {
    next(error)
  }
})

router.delete('/:cartId', getAuth, async function (req, res, next) {
  try {
    const id = await contenedor_carritos.deleteById(req.params.cartId)
    res.status(200).json(id)
  } catch (error) {
    next(error)
  }
})

router.use((err, req, res, next) => {
  switch (err.message) {
    case '-1':
        res.json({
            error: 'carrito no encontrado'
        })
        break;

    default:
        break;
  }
  next(err)
})

module.exports = router;
