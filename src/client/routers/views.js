const express = require('express');
const path = require('path');

const viewsRouter = express.Router();
viewsRouter.use('/', serveStatic(''));
viewsRouter.use('/', serveStatic('home'));
viewsRouter.use('/login', serveStatic('login'));
viewsRouter.use('/register', serveStatic('register'));
viewsRouter.use('/pw-find', serveStatic('pw_find'));
viewsRouter.use('/cart', serveStatic('cart'));
viewsRouter.use('/mypage', serveStatic('mypage'));
viewsRouter.use('/mypage/wishlist', serveStatic('mypage_wishlist'));
viewsRouter.use('/mypage/account', serveStatic('mypage_account'));
viewsRouter.use('/mypage/password', serveStatic('mypage_password'));
viewsRouter.use('/product-detail', serveStatic('product_detail'));
viewsRouter.use('/product-list', serveStatic('product_list'));
viewsRouter.use('/order', serveStatic('order_page'));
viewsRouter.use('/order-result', serveStatic('order_result'));
viewsRouter.use('/admin/category', serveStatic('admin_category'));
viewsRouter.use('/admin/product', serveStatic('admin_product'));
viewsRouter.use('/admin/order', serveStatic('admin_order'));
viewsRouter.use('/module', serveStatic('module'));
viewsRouter.use('/stripe', serveStatic('stripe'));
viewsRouter.use('/', serveStatic(''));

function serveStatic(resource) {
    const resourcePath = path.join(__dirname, `../views/${resource}`);
    const option = { index: `${resource}.html` };
    return express.static(resourcePath, option);
}

viewsRouter.use('/stripe', serveStatic('stripe'));

module.exports = viewsRouter;
