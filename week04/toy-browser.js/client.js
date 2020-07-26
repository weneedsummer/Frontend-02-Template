let net = require('net');
let parser = require('./parser.js');

class Request {
  constructor (options){
    let defaultOptions = {
      method: 'get',
      port: 80,
      path: '/',
      body: {},
      headers: {},
    };
    Object.assign(this, defaultOptions, options);

    if (!this.headers['Content-Type']){
      this.headers['Content-Type'] = 'application/x-www-urlencoded';
    }
    if (this.headers['Content-Type'] === 'application/json'){
      this.bodyText = JSON.stringify(this.body);
    }else if (this.headers['Content-Type'] === 'application/x-www-urlencoded'){
      this.bodyText = Object.keys(this.body).map((key)=>{
        return `${key}=${encodeURIComponent(this.body[key])}`
      }).join('&');
    }
    this.headers['Content-Length'] = this.bodyText.length;
  }

  send (connection){
    // console.log('请求信息：', this.method);
    // console.log(this.toString());
    return new Promise((resolve, reject) =>{
      let parse = new ResponseParse();
      if (connection){
        connection.write(this.toString());
      }else{
        connection = net.createConnection({
          host: this.host, 
          port: this.port,
        }, ()=>{
          
          connection.write(this.toString());
        });
      }
      connection.on('data', (data) =>{
        // console.log(data.toString());
        parse.receive(data.toString());
        if (parse.isFinished){
          resolve(parse.response); 
          connection.end();
        }
      });
      connection.on('error', (err)=>{
        reject(err);
      });
    }).catch((e)=>{
      console.log(e)
    });
  }
  toString (){
    return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map((key)=>{return `${key}: ${this.headers[key]}`}).join('\r\n')}\r\n\r\n${this.bodyText}`;
  }
}

class TrunckedBodyParser {
  constructor (){
    this.WAITING_LENGTH = 0;
    this.WAITING_LENGTH_LINE_END = 1;
    this.READING_TRUNK = 2;
    this.WAITING_NEW_LINE = 3;
    this.WAITING_NEW_LINE_END = 4;

    this.length = 0;
    this.content = [];
    this.isFinished = false;
    this.current = this.WAITING_LENGTH;

  }
  receiveChar (char){
    if (this.current === this.WAITING_LENGTH){
      if (char === '\r'){
        if (this.length === 0){
          this.isFinished = true;
        }
        this.current = this.WAITING_LENGTH_LINE_END;
      }else{
        this.length *= 16;
        this.length += parseInt(char, 16);
      }
    }else if (this.current === this.WAITING_LENGTH_LINE_END){
      if (char === '\n'){
        this.current = this.READING_TRUNK;
      }
    }else if (this.current === this.READING_TRUNK){
      this.content.push(char);
      this.length --;
      if (this.length === 0){
        this.current = this.WAITING_NEW_LINE;
      }
    }else if (this.current === this.WAITING_NEW_LINE){
      if (char === '\r'){
        this.current = this.WAITING_NEW_LINE_END;
      }
    }else if (this.current === this.WAITING_NEW_LINE_END){
      if (char === '\n'){
        this.current = this.WAITING_LENGTH;
      }
    }
  }
}
class ResponseParse {
  constructor (){
    this.WAITING_STATUS_LINE = 0;
    this.WAITING_STATUS_LINE_END = 1;
    this.WAITING_HEADER_NAME = 2;
    this.WAITING_HEADER_SPACE = 3;
    this.WAITING_HEADER_VALUE = 4;
    this.WAITING_HEADER_LINE_END = 5;
    this.WAITING_HEADER_BLOCK_END = 6;
    this.WAITING_BODY = 7;

    this.current = this.WAITING_STATUS_LINE;
    this.statusLine = '';
    this.headers = {};
    this.headerName = '';
    this.headerValue = '';
    this.bodyParser = null;
  }
  get isFinished (){
    return this.bodyParser && this.bodyParser.isFinished;
  }
  get response (){
    this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this.bodyParser.content.join('')
    }
  }
  receive (string){
    for (let i = 0, l = string.length; i < l; i++ ){
      this.receiveChar(string.charAt(i));
    }
  }
  receiveChar (char){
    if (this.current === this.WAITING_STATUS_LINE){
      if (char === '\r'){
        this.current = this.WAITING_STATUS_LINE_END;
      }else{
        this.statusLine += char;
      }
    }else if (this.current === this.WAITING_STATUS_LINE_END){
      if (char === '\n'){
        this.current = this.WAITING_HEADER_NAME;
      }
    }else if (this.current === this.WAITING_HEADER_NAME){
      if (char === ':'){  
        this.current = this.WAITING_HEADER_SPACE;
      }else if (char === '\r'){
        this.current = this.WAITING_HEADER_BLOCK_END;
        if (this.headers['Transfer-Encoding'] === 'chunked'){
          this.bodyParser = new TrunckedBodyParser();
        }
      }else{
        this.headerName += char;
      }
    }else if (this.current === this.WAITING_HEADER_SPACE){
      if (char === ' '){
        this.current = this.WAITING_HEADER_VALUE;
      }
    }else if (this.current === this.WAITING_HEADER_VALUE){
      if (char === '\r'){
        this.current = this.WAITING_HEADER_LINE_END;
        this.headers[this.headerName] = this.headerValue;
        this.headerName = '';
        this.headerValue = '';
      }else{
        this.headerValue += char;
      }
    }else if(this.current === this.WAITING_HEADER_LINE_END){
      if (char === '\n'){
        this.current = this.WAITING_HEADER_NAME;
      }
    }else if (this.current === this.WAITING_HEADER_BLOCK_END){
      if (char === '\n'){
        this.current = this.WAITING_BODY;
      }
    }else if (this.current === this.WAITING_BODY){
      // console.log(char);
      this.bodyParser.receiveChar(char);
    }
  }
}

void async function() {
  let request = new Request({
    path: '/',
    method: 'POST',
    host: '127.0.0.1',
    port: '8888',
    headers: {
      ["X-GEEK-TOKEN"]: 'Summer is coming',
    },
    body: {
      name: 'Summer'
    },
  });
  let response = await request.send();
  let dom = parser.parseHTML(response.body);
  console.log(dom);
}();