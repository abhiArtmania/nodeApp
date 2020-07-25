const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/user.controller');
const product_controller = require('../controllers/product.controller');
const scraping_controller = require('../controllers/scraping.controller');
const helper = require('../common/helper');

// User route
router.post('/register_user', user_controller.register_user);
router.post('/login',user_controller.login)
router.post('/userInfo',helper.varifyToken,user_controller.getUserInfo)
router.post('/logout',helper.varifyToken,user_controller.logout)

// Product route
router.post('/create', helper.varifyToken, product_controller.product_create);
router.post('/:id/product_details',helper.varifyToken,product_controller.product_details);
router.put('/:id/update',helper.varifyToken, product_controller.product_update);
router.delete('/:id/delete', helper.varifyToken, product_controller.product_delete);
router.post('/productList', helper.varifyToken, product_controller.product_list);
router.post('/productPagination', helper.varifyToken, product_controller.product_pagination);
router.post('/scrap_US_presedents',helper.varifyToken, scraping_controller.get_US_presedent_list);
module.exports = router;
