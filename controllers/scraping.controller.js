const rp = require('request-promise');
const $ = require('cheerio');
const presedentDetails = require('./presedentDetails');
const url = 'https://en.wikipedia.org/wiki/List_of_Presidents_of_the_United_States';


/**
     * @swagger
     * /api/scrap_US_presedents:
     *   post:
     *     tags:
     *       - Web scraping API
     *     description: Scraping of US president list from wikipedia
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

module.exports = {
  get_US_presedent_list: function(req,res){
    rp(url)
      .then((html)=>{
        let wikiUrls = [];
        let data = $('.wikitable > tbody > tr > td:nth-child(1) > a', html)
        for(let i = 0; i < data.length; i++){
          wikiUrls.push(data[i].attribs.href)
        }
        console.log(wikiUrls,"----------");
        return Promise.all(
          wikiUrls.map(function(url) {
            let a = presedentDetails.presedent_details('https://en.wikipedia.org' + url);
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
