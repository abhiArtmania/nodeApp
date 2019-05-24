const Product = require('../models/product.model');
module.exports = {
  test : function(req,res){
    res.send('Im in Test controller')
    //res.render('index', { title: 'Hey', message: 'Hello there!' })
  },
  product_create: function(req,res){
    let product = new Product({
      name:req.body.name,
      price:req.body.price
    });
    product.save(function(err, response){
      if(err){
        return next(err)
      }
      res.send({data: response, msg: "product saved"})
    })
  },
  product_details: function(req,res){
    Product.findById(req.params.id,function(err,response){
      if(err) throw err;
      res.send({data:response,message:'Product found'} )
    })
  },
  product_update: function(req,res){
    Product.findByIdAndUpdate(req.params.id,{$set:req.body},function(err,product){
      if(err) return next(err);
      res.send('Product updated successfully');
    })
  },
  product_delete: function(req,res){
    Product.findByIdAndRemove(req.params.id,function(err){
      if(err) return next(err);
      res.send('Product deleted successfully')
    })
  },
  product_list: function(req,res){
    Product.find(function(err,response){
      if(err) return next(err)
      res.send({data:response,message:'Success'})
    })
  },
  product_pagination: function(req,res){
    let pageNo = parseInt(req.query.pageNo)
    let size = parseInt(req.query.size)
    let response = {}
    let query = {}
    if( !pageNo || pageNo < 0 || pageNo === 0 ){
      response = {
        error: true,
        message: 'Invalide page number, should start with 1'
      }
      return res.json(response)
    } else if ( !size || size === 0 ){
      response = {
        error: true,
        message: 'Invalide size'
      }
      return res.json(response)
    } else {
      query.skip = size * ( pageNo - 1 )
      query.limit = size
      Product.count({},function(err,totalCount){
        if(err){
          return res.json({
            error:true,
            message:'Error fetching data'
          })
        } else {
          let totalPage = Math.ceil(totalCount/size)
          Product.find({},{},query,function(err,data){
            if(err){
              response = {
                error: true,
                message: 'Error fetching data'
              }
            } else {
              response = {
                error:  false,
                message:  data,
                totalPages: totalPage
              }
            }
            res.json(response)
          })
        }
      })
    }
  }
}
