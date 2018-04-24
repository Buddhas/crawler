# 爬取豆瓣小说图片
一个使用express以及cheerio(可以看作jQuery精简版)的基于Node.js的简单爬虫演示。

可以爬取信息网站信息以及爬取图片，可以将爬取的信息和图片保存到本地储存

# 涉及的插件： 
  `cheerio`是node中很好的分析网页内容的插件 
    由于涉及到的页面有五十个，这次我用了`async`做了并发控制async.mapLimit() 
    此外还有一个`superagent`模块，superagent是一个流行的nodejs第三方模块，专注于处理服务端/客户端的http请求

