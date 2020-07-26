const http = require('http');

let server = http.createServer(function(request, response){
  let body = [];
  request.on('error', function(err){
    console.error(err);
  }).on('data', function(chunk){
    body.push(chunk/* .toString() */);
  }).on('end', function(){
    body = Buffer.concat(body).toString();
    console.log('***********',body);
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end(`<html><head><title>Hello World</title></head><body><div><p><input></input></p></div></body></html>`)
  })
});

server.listen(8888);