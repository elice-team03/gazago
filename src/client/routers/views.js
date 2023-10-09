const express = require('express');
const path = require('path');
const { requiredLogin, blockLogin, checkAdmin } = require('../../server/middlewares/access-control');

const viewsRouter = express.Router();
viewsRouter.use('/', serveStatic(''));
viewsRouter.use('/', serveStatic('home'));
viewsRouter.use('/login', blockLogin, serveStatic('login')); // 로그인 안된 상태
viewsRouter.use('/register', blockLogin, serveStatic('register'));
viewsRouter.use('/pw-find', blockLogin, serveStatic('pw_find'));
viewsRouter.use('/cart', requiredLogin, serveStatic('cart')); // 로그인 된 상태
viewsRouter.use('/mypage', requiredLogin, serveStatic('mypage'));
viewsRouter.use('/mypage/wishlist', requiredLogin, serveStatic('mypage_wishlist'));
viewsRouter.use('/mypage/account', requiredLogin, serveStatic('mypage_account'));
viewsRouter.use('/product/detail', serveStatic('product_detail'));
viewsRouter.use('/product/list', serveStatic('product_list'));
viewsRouter.use('/order', requiredLogin, serveStatic('order_page'));
viewsRouter.use('/order/result', requiredLogin, serveStatic('order_result'));
viewsRouter.use('/admin/category', checkAdmin, serveStatic('admin_category'));
viewsRouter.use('/admin/product', checkAdmin, serveStatic('admin_product'));
viewsRouter.use('/admin/order', checkAdmin, serveStatic('admin_order'));
viewsRouter.use('/module', serveStatic('module'));

function serveStatic(resource) {
    const resourcePath = path.join(__dirname, `../views/${resource}`);
    const option = { index: `${resource}.html` };
    return express.static(resourcePath, option);
}

module.exports = viewsRouter;
