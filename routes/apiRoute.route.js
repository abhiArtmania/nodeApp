const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/user.controller');
const product_controller = require('../controllers/product.controller');
const scraping_controller = require('../controllers/scraping.controller');
const helper = require('../common/helper');
const path = require('path');
// Swagger
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const CONFIG = require('../common/CONFIG');

// User route
router.post('/register_user', user_controller.register_user);
router.post('/login',user_controller.login)
router.post('/userInfo',helper.varifyToken,user_controller.getUserInfo)
router.post('/logout',helper.varifyToken,user_controller.logout)

// Product route
router.post('/create', helper.varifyToken, product_controller.product_create);
router.post('/:productId/product_details',helper.varifyToken,product_controller.product_details);
router.put('/:productId/update',helper.varifyToken, product_controller.product_update);
router.delete('/:productId/delete', helper.varifyToken, product_controller.product_delete);
router.post('/productList', helper.varifyToken, product_controller.product_list);
router.post('/productPagination', helper.varifyToken, product_controller.product_pagination);
router.post('/scrap_US_presedents',helper.varifyToken, scraping_controller.get_US_presedent_list);

// Swagger set up
const options = {
  swaggerDefinition: {
    // openapi: "3.0.0",
    info: {
      title: "Abhishek POC",
      description:"Swagger to document and Express API",
      version: "1.0",
      // license: {
      //   name: "MIT",
      //   url: "https://choosealicense.com/licenses/mit/"
      // },
      // contact: {
      //   name: "Swagger",
      //   url: "https://swagger.io",
      //   email: "Info@SmartBear.com"
      // }
    },
    servers: [
      {
        url: `${CONFIG.domain}${CONFIG.port}/api/`
      }
    ]
  },
  apis: [
    path.join(__dirname, '../controllers/user.controller.js'),
    path.join(__dirname, '../controllers/product.controller.js'),
    path.join(__dirname, '../controllers/scraping.controller.js')
  ]
};

const specs = swaggerJsdoc(options);
router.use("/docs", swaggerUi.serve);
router.get(
  "/docs",
  swaggerUi.setup(specs, {
    explorer: true
  })
);


module.exports = router;
