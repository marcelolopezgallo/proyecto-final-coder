const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const Contenedor = require('./models/contenedor')

const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
const contenedor = new Contenedor('products.txt')
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/products', productsRouter);
app.use('/api/v1/cart', cartRouter);

module.exports = {
    app,
    contenedor
}
