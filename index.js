var express = require('express');
var server = express();
var app = require('./app');

var async = require('async');


server.get('/', function (req, res, next) {

  var urls = [];
   for(var i = 50; i < 90; i++) {
    urls.push('http://cl.cnncl.net/thread0806.php?fid=16&search=&page=' + i );
   }

  async.mapLimit(urls, 5, function (url, callback) {
    app.app(url, callback);
  }, function (err, result) {
    console.log('final-----------:');
    console.log(result);
  });
    res.send(urls);
});


// app.get('/', function (req, res, next) {
//   // superagent.get('https://cnodejs.org/')
//   superagent.get('http://cl.cnncl.net/htm_data/16/1510/1686513.html')
//     .end(function (err, sres) {
//       if (err) {
//         return next(err);
//       }
//       var $ = cheerio.load(sres.text);
//       var items = [];
//       $('#main input').each(function (idx, element) {
//         var $element = $(element);
//
//         if ($element.attr('src'))
//         {
//           items.push({
//             // title: $element.attr('title'),
//             href: $element.attr('src')
//           });
//         }else {
//
//         }
//
//       });
//
//        items.forEach(function(item){
//          console.log(item);
//           download(item.href, dir, Math.floor(Math.random()*100000) + item.href.substr(-4,4));
//        });
//       res.send(items);
//     });
// });

server.listen(3000, function () {
  console.log('app is listening at port 3000');
});

// var concurrencyCount = 0;
// var fetchUrl = function (url, callback) {
//   var delay = parseInt((Math.random() * 10000000) % 2000, 10);
//   concurrencyCount++;
//   console.log('现在的并发数是', concurrencyCount, '，正在抓取的是', url, '，耗时' + delay + '毫秒');
//   setTimeout(function () {
//     concurrencyCount--;
//     callback(null, url + ' html content');
//   }, delay);
// };
