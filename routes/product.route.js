const express = require('express');
const router = express.Router();
const product_controller = require('../controllers/product.controller');
router.get('/test',product_controller.test)
router.post('/create', product_controller.product_create);
router.get('/:id/product_details',product_controller.product_details);
router.put('/:id/update',product_controller.product_update);
router.delete('/:id/delete',product_controller.product_delete);
router.get('/productList',product_controller.product_list);
module.exports = router;
