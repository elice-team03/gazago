const express = require('express');
const usersRouter = require('./users');
const productsRouter = require('./products');
const categoriesRouter = require('./categories');
const deliveriesRouter = require('./deliveries');
const ordersRouter = require('./orders');

const app = express();
app.use(express.json());

app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);
app.use('/deliveries', deliveriesRouter);
app.use('/orders', ordersRouter);

module.exports = app;
