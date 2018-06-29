# 爬取豆瓣小说图片
一个使用express以及cheerio(可以看作jQuery精简版)的基于Node.js的简单爬虫演示。

可以爬取信息网站信息以及爬取图片，可以将爬取的信息和图片保存到本地储存

![photo](https://github.com/Buddhas/crawler/blob/master/crawler/img/1.png)
![photo](https://github.com/Buddhas/crawler/blob/master/crawler/img/3.png)

## 爬取过程： 

   由于涉及到的页面有五十个，这次我用了`async`做了并发控制async.mapLimit() 
   此外还有一个`superagent`模块，superagent是一个流行的nodejs第三方模块，专注于处理服务端/客户端的http请求
   
   
   * 引入相关插件和定义元变量
   ```javascript
      var cheerio = require('cheerio');
      var superagent = require('superagent');
      var express = require('express');
      var async = require('async');
      var fs = require('fs');



      var app = express();
      var urls = [];//抓取网站的集合
      var baseUrl = 'https://book.douban.com/tag/%E5%B0%8F%E8%AF%B4';//抓取的网站
      var concurrencyCount = 0;
      var items = [];//保存书籍信息
      var imgDir = 0;//保存分页目录
      var rootDir = './豆瓣图片';//图片根目录
   ```
   * 利用`cheerio`分析网页内容并保存到变量
   ```javascript
       $('.subject-item').each(function(index,element){
            var title = $(element).find('.info').find('h2').find('a').attr('title');
            var authorAndOther = $(element).find('.info').find('.pub').text();
            var author = authorAndOther.substring(0,authorAndOther.indexOf('/'));
            var titleUrl = $(element).find('.info').find('h2').find('a').attr('href');
            var picUrl = $(element).find('.pic').find('a').find('img').attr('src');
            savePicture(picUrl,dir,title);
            items.push({
                Title:title,
                Author:author,
                TitleUrl:titleUrl
            });
            
        });
   ```
   * 利用node保存图片到本地
   ```javascript
      //保存图片
   function savePicture(url,dir,fileName){
      fileName = fileName + '.jpg';
      superagent.get(url).pipe(fs.createWriteStream(dir+'/'+fileName));
   }
   ```
   
   * 要爬取的页面过多，用async做并发控制
   ```javascript
      function asyncColtrol(){
    getUrl();
    async.mapLimit(urls,5,function(url,callback){
        getContent(url,callback);
    },function(err,result){
        if(err){
            console.log(err);
        }
        app.get('/',function(req,res){
            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
            print(res,items);
        })
        
        
    })
}
   ```
   
   * 起一个node服务
   ```javascript
   app.listen(3000, function() {
      console.log('app is listening at port 3000');
      fs.mkdir(rootDir);
      asyncColtrol();
   });
   ```
   
   
   

