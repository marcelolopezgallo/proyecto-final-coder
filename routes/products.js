const express = require('express');
const router = express.Router();
const Contenedor = require( '../models/contenedor')

const contenedor = new Contenedor('./db/productos.txt')
const ADMIN = true

function getAuth(req, res, next) {
  if (ADMIN) next()
  else throw Error('método no permitido')
}


router.get('/', async function (req, res, next) {
  try {
    const products = await contenedor.getAll()
    res.json(products)
  } catch (error) {
    next(error)
  }
});

router.get('/:id', async function (req, res, next) {
  try {
    const products = await contenedor.getById(req.params.id)
    res.json(products)
  } catch (error) {
    next(error)
  }
})

router.post('/', getAuth, async function (req, res, next) {
  try {
    productData = req.body
    const createdProduct = await contenedor.create(productData)
    res.status(201).json(createdProduct)
  } catch (error) {
    next(error)
  }
})

router.put('/:id', getAuth, async function (req, res, next) {
  try {
    productData = req.body
    const updatedProduct = await contenedor.update(req.params.id, productData)
    res.status(200).json(updatedProduct)
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', getAuth, async function (req, res, next) {
  try {
    const id = await contenedor.deleteById(req.params.id)
    res.status(200).json(id)
  } catch (error) {
    next(error)
  }
})

router.use((err, req, res, next) => {
  switch (err.message) {
    case '-1':
        res.json({
            error: 'producto no encontrado'
        })
        break;

    default:
        break;
  }
  next(err)
})

module.exports = router;
