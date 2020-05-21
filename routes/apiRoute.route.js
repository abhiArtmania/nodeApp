const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/user.controller');
const product_controller = require('../controllers/product.controller');
const scraping_controller = require('../controllers/scraping.controller');

// User route
router.post('/register_user', user_controller.register_user);
router.post('/login',user_controller.login)
router.get('/test',product_controller.varifyToken,user_controller.test)

// Product route
router.post('/create', product_controller.varifyToken, product_controller.product_create);
router.get('/:id/product_details',product_controller.product_details);
router.put('/:id/update',product_controller.product_update);
router.delete('/:id/delete',product_controller.product_delete);
router.get('/productList',product_controller.product_list);
router.get('/productPagination',product_controller.product_pagination);
router.get('/scrap_US_presedents',scraping_controller.get_US_presedent_list);
module.exports = router;
