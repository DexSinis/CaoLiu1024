var eventproxy = require('eventproxy');
var superagent = require('superagent-charset');
var cheerio = require('cheerio');
var download = require('./download');
var request = require("request");
var fs = require('fs');
var async = require('async');
// url 模块是 Node.js 标准库里面的
// http://nodejs.org/api/url.html
var url = require('url');
var dir = './images3';

var configMap = {
    numberOfParallel: 5,
    timeout: 15000,
    userAgent: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:39.0) Gecko/20100101 Firefox/39.0'
};

function app (cnodeUrl,callback){
var cnodeUrl = cnodeUrl;

superagent.get(cnodeUrl)
  .charset('gbk')
  .end(function (err, res) {
    if (err) {
      return console.error(err);
    }
    var topicUrls = [];
    var $ = cheerio.load(res.text);
    // console.log(res.text);
    // 获取首页所有的链接
    $('tbody tr td a').each(function (idx, element) {
      console.log($element);
      var $element = $(element);
      // $element.attr('href') 本来的样子是 /topic/542acd7d5d28233425538b04
      // 我们用 url.resolve 来自动推断出完整 url，变成
      // https://cnodejs.org/topic/542acd7d5d28233425538b04 的形式
      // 具体请看 http://nodejs.org/api/url.html#url_url_resolve_from_to 的示例
      // var href = url.resolve(cnodeUrl, $element.attr('class'));
      var href = $element.attr('href');
      if (href.substr(0,8)==="htm_data") {
        var href = url.resolve(cnodeUrl,href);
          topicUrls.push(href);
      }

    });

    console.log(topicUrls);
    // 得到 topicUrls 之后

  // // 得到一个 eventproxy 的实例
  // var ep = new eventproxy();
  //
  // // 命令 ep 重复监听 topicUrls.length 次（在这里也就是 40 次） `topic_html` 事件再行动
  // ep.after('topic_html', topicUrls.length, function (topics) {
  //   // topics 是个数组，包含了 40 次 ep.emit('topic_html', pair) 中的那 40 个 pair
  //
  //   // 开始行动
  //   topics = topics.map(function (topicPair) {
  //     // 接下来都是 jquery 的用法了
  //     var topicUrl = topicPair[0];
  //     var topicHtml = topicPair[1];
  //     var $ = cheerio.load(topicHtml);
  //     var $elements = $('tbody div span input');
  //     var srcUrls = [];
  //     // var $elementTitle = $('.bbs-hd-h1 h1');
  //     $elements.each(function (idx, element) {
  //       var $element = $(element);
  //       // $element.attr('href') 本来的样子是 /topic/542acd7d5d28233425538b04
  //       // 我们用 url.resolve 来自动推断出完整 url，变成
  //       // https://cnodejs.org/topic/542acd7d5d28233425538b04 的形式
  //       // 具体请看 http://nodejs.org/api/url.html#url_url_resolve_from_to 的示例
  //       var src = $element.attr('src');
  //       srcUrls.push(src);
  //     });
  //     return ({
  //         //  title: $elementTitle.attr('data-title'),
  //          srcUrls: srcUrls
  //       // comment1: $('.reply_content').eq(0).text().trim(),
  //     });
  //   });
  //
  //   console.log('final:');
  //   console.log(topics);
  //   topics.forEach(function(topic){
  //      download.download(topic.title,topic.srcUrls);
  //   })
  // });

  topicUrls.forEach(function (item) {
    superagent.get(item).charset('gbk')
      .end(function (err, res) {
        console.log('fetch ' + item + ' successful');
        superagent.get(item)
          .end(function (err, sres) {
            if (err) {
              // return next(err);
             }
            // if (!res.text) {
            //
            // }
            try {
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


              async.mapLimit(items, 1, function (item, callback) {
                // app.app(url, callback);
                    console.log(item+"123456------");
                    download(item.href, dir, Math.floor(Math.random()*100000) + item.href.substr(-4,4));
              }, function (err, result) {
                console.log('final-----------:');
                console.log(result);
              });

              //  items.forEach(function(item){
              //    console.log(item);
              //     download(item.href, dir, Math.floor(Math.random()*100000) + item.href.substr(-4,4));
              //  });
            } catch (e) {

            } finally {

            }

            // res.send(items);
          });
        // download(item, dir, Math.floor(Math.random()*100000) + item.substr(-4,4));
        // ep.emit('topic_html', [topicUrl, res.text]);
      });
  });
});
}

//下载方法
var download = function(item, dir, filename){
  // request.head(url, function(err, res, body){
  // try {
  //
  //       request(url).pipe(fs.createWriteStream(dir + "/" + filename));
  //
  // } catch (e) {
  //   console.log('new error..');
  // } finally {
  //
  // }
  //   });
  if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
  }

  var request_stream = request({
      url: item,
      timeout: configMap.timeout,
      headers: {
          'User-Agent': configMap.userAgent
      }
  });
  request_stream.on('error', function (error) {
      console.log('downloadImgs| 下载 ' + item + ' 失败| Error: ' + error);
  });
  request_stream.on('response', function (response) {
      // 我也不知道有时候response为啥会为空,所以为了避免出现response为空的情况
      // 我使用了事件监听的方式来处理数据
      if (response.statusCode === 404) {
          console.log('downloadImgs| 无效的下载地址 ' + item);
      }
      else {
          var str = dir +"/"+ filename + '1.jpg';
          // 虽然下面这条命令会马上执行完毕,但是可能数据还是没有下载完成,所以需要监听end事件
          request_stream.pipe(fs.createWriteStream(str));
          // index++;
      }
  });
  request_stream.on('end', function () {
      // callback();
  });

};


exports.app = app;
