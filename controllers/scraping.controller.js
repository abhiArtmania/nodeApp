const rp = require('request-promise');
const $ = require('cheerio');
const presedentDetails = require('./presedentDetails');
const url = 'https://en.wikipedia.org/wiki/List_of_Presidents_of_the_United_States';

module.exports = {
  get_US_presedent_list: function(req,res){
    rp(url)
      .then((html)=>{
        let wikiUrls = [];
        let data = $('big > a', html)
        for(let i = 0; i < data.length; i++){
          wikiUrls.push(data[i].attribs.href)
        }
        return Promise.all(
          wikiUrls.map(function(url) {
            let a = presedentDetails('https://en.wikipedia.org' + url);
            return a;
          })
        );
      })
      .then(function(presidents) {
        res.send(presidents)
      })
      .catch(function(err){
        throw err;
      })
  }
}
