const express = require('express');
const path = require('path');
const {
    allowUser,
    allowUserAndAdmin,
    blockUserAndAdmin,
    allowOrdererNotUserAndUserAndAdmin,
    allowAdmin,
} = require('../../server/middlewares/access-control');
// 관리자: admin, 일반회원: user, 비회원 주문자: ordererNotUser
const viewsRouter = express.Router();
viewsRouter.use('/', serveStatic('home'));
viewsRouter.use('/login', blockUserAndAdmin, serveStatic('login'));
viewsRouter.use('/register', blockUserAndAdmin, serveStatic('register'));
viewsRouter.use('/pw-find', blockUserAndAdmin, serveStatic('pw_find'));
viewsRouter.use('/cart', allowUserAndAdmin, serveStatic('cart'));
viewsRouter.use('/mypage', allowUser, serveStatic('mypage'));
viewsRouter.use('/mypage/wishlist', allowUser, serveStatic('mypage_wishlist'));
viewsRouter.use('/mypage/account', allowUser, serveStatic('mypage_account'));
viewsRouter.use('/product/detail', serveStatic('product_detail'));
viewsRouter.use('/product/list', serveStatic('product_list'));
viewsRouter.use('/order', allowOrdererNotUserAndUserAndAdmin, serveStatic('order_page'));
viewsRouter.use('/order/result', allowOrdererNotUserAndUserAndAdmin, serveStatic('order_result'));
viewsRouter.use('/admin/category', allowAdmin, serveStatic('admin_category'));
viewsRouter.use('/admin/product', allowAdmin, serveStatic('admin_product'));
viewsRouter.use('/admin/order', allowAdmin, serveStatic('admin_order'));
viewsRouter.use('/module', serveStatic('module'));

function serveStatic(resource) {
    const resourcePath = path.join(__dirname, `../views/${resource}`);
    const option = { index: `${resource}.html` };
    return express.static(resourcePath, option);
}

module.exports = viewsRouter;
