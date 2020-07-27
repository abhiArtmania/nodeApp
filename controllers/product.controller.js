const Product = require('../models/product.model');
const jwt = require('jsonwebtoken');
const CONFIG = require('../common/CONFIG');
const helper = require('../common/helper');

/**
     * @swagger
     * /api/create:
     *   post:
     *     tags:
     *       - Product API
     *     description: Add new product
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: authorization
     *         description: Authentication Token
     *         in: header
     *         required: true
     *       - name: CreateProduct
     *         description: New product object
     *         in: body
     *         required: true
     *         schema:
     *          type: object
     *          properties:
     *            name:
     *              type: string
     *            price:
     *              type: number
     *            _id:
     *              type: string
     *          example:         # sample data
     *            name: 'Pencil'
     *            price: 20
     *            _id: '5f1ab9c4f23c4a52250fb0fa'
     *     responses:
     *       200:
     *         description: Returns success message
     */

const product_create = async function(req,res){
  let name = req.body.name,
      price = req.body.price;
    if(!name || !price){
      return helper.success_response(res,null,'Fields Missing!',false)
    }  else {
      let newProduct = await Product.create({
        name:req.body.name,
        price:req.body.price
      })
      if(newProduct && newProduct._id){
        return helper.success_response(res,newProduct,'Product saved!',true)
      } else {
        return helper.success_response(res,null,'Failed!',false)
      }
    }
}

/**
     * @swagger
     * /api/{productId}/product_details:
     *   post:
     *     tags:
     *       - Product API
     *     description: Product details
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: authorization
     *         description: Authentication Token
     *         in: header
     *         required: true
     *       - name: productId
     *         description: Numeric ID of the product to get details
     *         in: path
     *         required: true
     *       - name: Payload
     *         description: user id object
     *         in: body
     *         required: true
     *         schema:
     *          type: object
     *          properties:
     *            _id:
     *              type: string
     *          example:         # sample data
     *            _id: '5f1ab9c4f23c4a52250fb0fa'
     *     responses:
     *       200:
     *         description: Returns success message
     */

const product_details = async function(req,res){
  let productId = req.params.productId
  if(productId){
    let data = await Product.findOne({
      _id:productId
    })
    if(data && data._id){
      return helper.success_response(res,data,'Product found!',true)
    } else {
      return helper.success_response(res,null,'Failed!',false)
    }
  } else {
    return helper.success_response(res,null,'Product id missing!',false)
  }
}

/**
     * @swagger
     * /api/{productId}/update:
     *   put:
     *     tags:
     *       - Product API
     *     description: Product update
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: authorization
     *         description: Authentication Token
     *         in: header
     *         required: true
     *       - name: productId
     *         description: Numeric ID of the product to update
     *         in: path
     *         required: true
     *       - name: Payload
     *         description: user id product details to update
     *         in: body
     *         required: true
     *         schema:
     *          type: object
     *          properties:
     *            _id:
     *              type: string
     *              required: true
     *            name:
     *              type: string
     *              required: false
     *            price:
     *              type: number
     *              required: false
     *     responses:
     *       200:
     *         description: Returns success message
     */

const product_update = async function(req,res){
  let productId = req.params.productId
  delete req.body._id
  if(productId){
    let data = await Product.findOneAndUpdate({_id:productId},{$set:req.body},{new:true})
    if(data){
      return helper.success_response(res,data,'Product updated!',true)
    } else {
      return helper.success_response(res,null,'Failed!',false)
    }
  } else {
    return helper.success_response(res,null,'Product id missing!',false)
  }
}

/**
     * @swagger
     * /api/{productId}/delete:
     *   delete:
     *     tags:
     *       - Product API
     *     description: Product delete
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: authorization
     *         description: Authentication Token
     *         in: header
     *         required: true
     *       - name: productId
     *         description: Numeric ID of the product to delete
     *         in: path
     *         required: true
     *       - name: Payload
     *         description: user id object
     *         in: body
     *         required: true
     *         schema:
     *          type: object
     *          properties:
     *            _id:
     *              type: string
     *              required: true
     *     responses:
     *       200:
     *         description: Returns success message
     */

const product_delete = async function(req,res){
  let productId = req.params.productId
  if(productId){
    let data = await Product.remove({_id:productId})
    if(data){
      return helper.success_response(res,null,'Product deleted successfully',true)
    } else {
      return helper.success_response(res,null,'Failed!',false)
    }
  } else {
    return helper.success_response(res,null,'Product id missing!',false)
  }
}

/**
     * @swagger
     * /api/productList:
     *   post:
     *     tags:
     *       - Product API
     *     description: Product List
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: authorization
     *         description: Authentication Token
     *         in: header
     *         required: true
     *       - name: Payload
     *         description: user id in object
     *         in: body
     *         required: true
     *         schema:
     *          type: object
     *          properties:
     *            _id:
     *              type: string
     *              required: true
     *     responses:
     *       200:
     *         description: Returns success message
     */

const product_list = async function(req,res){
  let data = await Product.find()
  if(data){
    return helper.success_response(res,data,'Product List!',true)
  } else {
    return helper.success_response(res,null,'Failed!',false)
  }
}

/**
     * @swagger
     * /api/productPagination:
     *   post:
     *     tags:
     *       - Product API
     *     description: Product listing with pagination and search
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: authorization
     *         description: Authentication Token
     *         in: header
     *         required: true
     *       - name: pageNo
     *         description: Page number
     *         in: query
     *         required: true
     *         min: 1
     *       - name: size
     *         description: products per page
     *         in: query
     *         required: true
     *         min: 1
     *       - name: search
     *         description: Search by product name
     *         in: query
     *       - name: Payload
     *         description: user id in object
     *         in: body
     *         required: true
     *         schema:
     *          type: object
     *          properties:
     *            _id:
     *              type: string
     *              required: true
     *     responses:
     *       200:
     *         description: Returns success message
     */

const product_pagination = async function(req,res){
  let searchValue = req.query.search
  let pageNo = parseInt(req.query.pageNo)
  let size = parseInt(req.query.size)
  let query = {}
  if( !(pageNo*1) || pageNo*1 < 1 ){
    return helper.success_response(res,null,'Invalide page number, should start with 1',false)
  } else if ( !size*1 ){
    return helper.success_response(res,null,'Invalide size',false)
  } else {
    query.skip = size * ( pageNo - 1 )
    query.limit = size
    let productList = await Product.aggregate([{
      $facet:{                   //$facet processes multiple aggregation pipelines within a single stage on the same set of input documents
        totalData:[
          {$match:{ name: new RegExp(searchValue, "gi") }},
          {$skip:query.skip},
          {$limit:query.limit}
        ],
        totalCount:[
          {$count:'count'}
          // {
          //   $group:{
          //     count:{$sum:1}
          //   }
          // }
        ]
      }
    }])

    if(productList){
      let finalList = {};
      finalList['data'] = productList[0]['totalData'];
      finalList['count'] = productList[0]['totalCount'][0]['count'];
      return helper.success_response(res,finalList,'Product List',true)
    } else {
      return helper.success_response(res,null,'Failed',false)
    }
  }
}

module.exports = {
  product_create,
  product_details,
  product_update,
  product_delete,
  product_list,
  product_pagination
}
