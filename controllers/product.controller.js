const Product = require('../models/product.model');
const jwt = require('jsonwebtoken');
const CONFIG = require('../common/CONFIG');
const helper = require('../common/helper');

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

const product_details = async function(req,res){
  let productId = req.params.id
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

const product_update = async function(req,res){
  let productId = req.params.id
  if(productId){
    let data = await Product.update({_id:productId},{$set:req.body})
    if(data && data._id){
      return helper.success_response(res,data,'Product updated!',true)
    } else {
      return helper.success_response(res,null,'Failed!',false)
    }
  } else {
    return helper.success_response(res,null,'Product id missing!',false)
  }
}

const product_delete = async function(req,res){
  let productId = req.params.id
  if(productId){
    let data = await Product.remove({_id:req.params.id})
    if(data){
      return helper.success_response(res,null,'Product deleted successfully',true)
    } else {
      return helper.success_response(res,null,'Failed!',false)
    }
  } else {
    return helper.success_response(res,null,'Product id missing!',false)
  }
}

const product_list = async function(req,res){
  let data = await Product.find()
  if(data){
    return helper.success_response(res,data,'Product List!',true)
  } else {
    return helper.success_response(res,null,'Failed!',false)
  }
}

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
