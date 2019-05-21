const Product = require('../models/product.model');
module.exports = {
  test : function(req,res){
    res.send('Im in Test controller')
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
  }
}
