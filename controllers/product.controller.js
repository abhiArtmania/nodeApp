const Product = require('../models/product.model');
module.exports = {
  test : function(req,res){
    res.send('Im in Test controller')
    //res.render('index', { title: 'Hey', message: 'Hello there!' })
  },
  product_create: function(req,res){
    Product.create({
      name:req.body.name,
      price:req.body.price
    }).then(function(response){
      console.log(response,"-----response");
      res.send({data: response, msg: "product saved"})
    }).catch(function(error){
      console.log(error,"------error");
      throw error;
    })
  },
  product_details: function(req,res){
    Product.findOne({
      _id:req.params.id
    }).then(function(response){
      console.log(response,"---response");
      res.send({data:response,message:'Product found'})
    }).catch(function(error){
      console.log(error,"------error");
      throw error;
    })
  },
  product_update: function(req,res){
    Product.update({_id:req.params.id},{$set:req.body}).then((response)=>{
      res.send('Product updated successfully')
    }).catch((error)=>{
      throw error;
    })
  },
  product_delete: function(req,res){
    Product.remove({_id:req.params.id}).then((response)=>{
      res.send('Product deleted successfully')
    }).catch((error)=>{
      throw error;
    })
  },
  product_list: function(req,res){
    Product.find().then((response)=>{
      res.send({data:response,message:'Success'})
    }).catch((error)=>{
      throw error;
    })
  },
  product_pagination: function(req,res){
    let pageNo = parseInt(req.query.pageNo)
    let size = parseInt(req.query.size)
    let response = {}
    let query = {}
    if( !(pageNo*1) || pageNo*1 < 1 ){
      response = {
        error: true,
        message: 'Invalide page number, should start with 1'
      }
      return res.json(response)
    } else if ( !size*1 ){
      response = {
        error: true,
        message: 'Invalide size'
      }
      return res.json(response)
    } else {
      query.skip = size * ( pageNo - 1 )
      query.limit = size
      Product.find({}).skip(query.skip).limit(query.limit).lean().then((response)=>{
        let final = {};
        final['data'] = response;
        final['count'] = response.length;
        res.json(final)
      }).catch((error)=>{
        throw error;
      })

      // Product.count({},(err,totalCount)=>{
      //   if(err){
      //     return res.json({
      //       error:true,
      //       message:'Error fetching data'
      //     })
      //   } else {
      //     let totalPage = Math.ceil(totalCount/size)
      //     Product.find({},{},query,function(err,data){
      //       if(err){
      //         response = {
      //           error: true,
      //           message: 'Error fetching data'
      //         }
      //       } else {
      //         response = {
      //           error:  false,
      //           message:  data,
      //           totalPages: totalPage
      //         }
      //       }
      //       res.json(response)
      //     })
      //   }
      // })
    }
  }
}
