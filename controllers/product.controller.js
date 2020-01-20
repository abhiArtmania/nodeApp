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
      res.send({data: response, msg: "product saved"})
    }).catch(function(error){
      throw error;
    })
  },
  product_details: function(req,res){
    Product.findOne({
      _id:req.params.id
    }).then(function(response){
      res.send({data:response,message:'Product found'})
    }).catch(function(error){
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
      Product.aggregate([{
        $facet:{                   //$facet processes multiple aggregation pipelines within a single stage on the same set of input documents
          totalData:[
            {$match:{}},
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
      }]).then((response)=>{
        let final = {};
        final['data'] = response[0]['totalData'];
        final['count'] = response[0]['totalCount'][0]['count'];
        res.json(final)
      }).catch((error)=>{
        throw error;
      })
    }
  }
}
