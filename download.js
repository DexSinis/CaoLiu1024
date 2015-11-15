var express = require('express');
var cheerio = require('cheerio');
var superagent = require('superagent-charset');
var fs = require('fs');
var mkdirp = require('mkdirp');
var request = require("request");
var app = express();
var dir = './images';

function download(title,srcUrls)
{
  // srcUrls.forEach(function(src){
  //
  // });

  for (var i = 0; i < srcUrls.length; i++) {
   downloadSrc(srcUrls[i],dir,title+"-"+i+srcUrls[i].substr(-4,4));
  //  console.log(srcUrls[i]+"------------");
  }
  //下载方法
}
var downloadSrc = function(url, dir, filename){
    request.head(url, function(err, res, body){
         try {
             request(url).pipe(fs.createWriteStream(dir + "/" + filename));
         } catch (err) {
            console.log(err);
         } finally {

         }

});


}
exports.download = download;
