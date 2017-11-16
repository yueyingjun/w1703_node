var http=require("http");
var path=require("path");
var fs=require("fs");
const zlib = require('zlib');

var config=require("./config.json");


/* 流 数据流  内存   100g
const gzip = zlib.createGzip();
fs.createReadStream("./config.json").pipe(gzip).pipe(fs.createWriteStream("aa.zip"))process.exit();
*/



http.createServer(function(req,res){

    if(req.url=="/favicon.ico") {
        res.end();
    }else{
       var root=path.resolve(config.root);
       fs.stat(root,function(err){
           if(err){
               res.setHeader("content-type","text/html;charset=utf-8");
               res.end("根目录不存在");
           }else{
               var reqUrl=req.url;
               var fullpath;
              if(!path.extname(reqUrl)){
                fullpath=path.join(root,reqUrl,config.entry);
              }else{

                  if(/(\.jpg)|(\.png)|(\.css)|(\.js)/.test(path.extname(reqUrl))){
                      fullpath=path.join(root,config.static,reqUrl);
                  }else {
                      fullpath = path.join(root, reqUrl);
                  }
              }

              var ext=path.extname(fullpath);


              fs.stat(fullpath,function(err,info){
                  if(err){
                      res.setHeader("content-type","text/html;charset=utf-8");
                      res.writeHead(404);
                      res.end("页面不存在");
                  }else{
                      res.setHeader("content-type",config.type[ext]+";charset=utf-8");
                      /*
                      res.setHeader("Cache-Control","max-age=15");

                      服务器的内容没有变化 不需要
                      服务器的内容有变化  需要
                      */
                      res.setHeader("Set-Cookie","name=zhangsan");

                      res.setHeader("Last-Modified",info.mtime);
                      var time=req.headers["if-modified-since"];
                      res.setHeader("Content-Encoding","gzip");

                      if(time&&new Date(time).getTime()==new Date(info.mtime).getTime()){
                          res.writeHead(304);
                          console.log(1)
                          res.end();
                      }else {
                          console.log(2);
                          var read=fs.createReadStream(fullpath);
                          const gzip = zlib.createGzip()
                          read.pipe(gzip).pipe(res)

                      }
                  }
              })


           }
       })

    }
}).listen(8888,function(){
    console.log("服务器启动....");
});








