var express = require('express');
var cheerio = require('cheerio');
var superagent = require('superagent');
var request = require("request");
var fs = require('fs');
// var download = require('./download');
var dir = './images';
var app = express();

app.get('/', function (req, res, next) {
  // superagent.get('https://cnodejs.org/')
  superagent.get('http://cl.cnncl.net/htm_data/16/1510/1686513.html')
    .end(function (err, sres) {
      if (err) {
        return next(err);
      }
      var $ = cheerio.load(sres.text);
      var items = [];
      $('#main input').each(function (idx, element) {
        var $element = $(element);

        if ($element.attr('src'))
        {
          items.push({
            // title: $element.attr('title'),
            href: $element.attr('src')
          });
        }else {

        }

      });

       items.forEach(function(item){
         console.log(item);
          download(item.href, dir, Math.floor(Math.random()*100000) + item.href.substr(-4,4));
       });
      res.send(items);
    });
});

//下载方法
var download = function(url, dir, filename){
  request.head(url, function(err, res, body){
  try {

        request(url).pipe(fs.createWriteStream(dir + "/" + filename));

  } catch (e) {
    console.log('new error..');
  } finally {

  }
    });

};

app.listen(3000, function () {
  console.log('app is listening at port 3000');
});
