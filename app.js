var http = require('http');
var fs = require('fs');

var SerialPort = require("serialport")

var ReadlineParser = require('@serialport/parser-readline')
var port = new SerialPort('COM4', {
  baudRate: 9600,
  dataBits: 8,
  parity: 'none',
  stopBits: 1,
  flowControl:false 
});

var parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }))

console.log("hello there");

// parser.on("data", function(data) {
//   console.log("hi");
//   console.log(data);
// })

// this one sends info to the website
var app = http.createServer(function(req, res) {
  if (req.url === '/') {
    // Read the index.html file
    fs.readFile('index.html', 'utf8', function(err, index) {
      if (err) {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Internal Server Error');
        return;
      }

      // Replace the placeholder in the HTML with the actual image data
      fs.readFile('HUCK.jpg', function(err, picture) {
        if (err) {
          res.writeHead(500, {'Content-Type': 'text/plain'});
          res.end('Internal Server Error');
          return;
        }

        // Replace the placeholder in the HTML with the actual image data
        index = index.replace('<img src="/HUCK.jpg"/>', '<img src="data:image/jpeg;base64,' + picture.toString('base64') + '" />');

        // Set headers and send the modified HTML in the response
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(index);
      });
    });
  } else {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('Not Found');
  }
});

var io = require('socket.io').listen(app);

io.on("connection", function(socket){
  console.log("Node.js is Listening");

});


let obj = {
  "id": [],
  "score": [],

}
port.on("data", () => {
  let length =parser._readableState.buffer.length;
  //console.log(port);
  obj.id.unshift(parser._readableState.buffer[length-1]);
  obj.score.unshift(parser._readableState.buffer[length-2]);
  console.log(parser._readableState.buffer[length-2])
  console.log(parser._readableState.buffer[length-1]);

  io.emit('data', obj);
  //console.log(parser._readableState.buffer[length-1]);
});





app.listen(3000);