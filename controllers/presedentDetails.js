const rp = require('request-promise');
const $ = require('cheerio');

const presedent_details = function(url) {
  return rp(url)
    .then(function(html) {
      let a = {
        name: $('.firstHeading', html).text(),
        birthday: $('.bday', html).text(),
      }
      return a;
    })
    .catch(function(err) {
      //handle error
    });
}

module.exports = {
  presedent_details
}
