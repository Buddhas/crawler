

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


//创建分页目录
function createDir(fileName){
    fileName = rootDir + '/' + fileName;
    fs.mkdir(fileName,function(err){
        console.log('创建'+fileName+'目录成功');
    });
    return fileName;
}

//保存图片
function savePicture(url,dir,fileName){
    fileName = fileName + '.jpg';
    superagent.get(url).pipe(fs.createWriteStream(dir+'/'+fileName));
}

//生成要抓取的地址
function getUrl() {
    for (var i = 1; i <= 50; i++) {         
        if (i == 1) {
            urls.push(baseUrl);
        } else {
            var tmp = baseUrl + '?start=' + (20 * i - 20);
            urls.push(tmp);
        }
    }
}

//输出内容
function print(res,items) {
    res.write('<h2>一共爬取文章：'+items.length+'<h2/>');
    for (var i = 0; i < items.length; i++) {
        res.write("<strong>文章标题：" +
            items[i].Title +
            "作者：" +
            items[i].Author +
            '文章链接<a>' +
            items[i].TitleUrl +
            '</a></strong><br/>')
    }
    
}

//抓取内容
function getContent(url,callback){
    superagent.get(url).end(function(err,sres){
        imgDir++;
        fileName = '第' + imgDir +'页';
        var dir = createDir(fileName);
        var $ = cheerio.load(sres.text);
        var delay = parseInt((Math.random() * 30000000) % 1000, 10);
        //保存书籍信息
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
        setTimeout(function(){
            callback(null,items);
        },delay);
        
        
    })
}

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

app.listen(3000, function() {
    console.log('app is listening at port 3000');
    fs.mkdir(rootDir);
    asyncColtrol();
});