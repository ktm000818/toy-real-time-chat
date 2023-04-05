"use strict";

var _express = _interopRequireDefault(require("express"));
var _socket = _interopRequireDefault(require("socket.io"));
var _http = _interopRequireDefault(require("http"));
var _fs = _interopRequireDefault(require("fs"));
var _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
// express 객체 생성
var app = (0, _express["default"])();
var server = _http["default"].createServer(app);
var io = (0, _socket["default"])(server);
app.use(_express["default"]["static"](_path["default"].resolve(__dirname, "..", "chat-ui-react", "dist")));
app.get("/", function (req, res) {
  _fs["default"].readFile('../chat-ui-react/dist/index.html', function (err, data) {
    if (err) {
      console.error('error');
    } else {
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      res.write(data);
      res.end();
      console.log("유저가 / 으로 접속했습니다.");
    }
  });
});
io.sockets.on('connection', function (socket) {
  socket.on('newUser', function (name) {
    console.log(name + " is connected.");
    socket.name = name;
    io.sockets.emit('update', {
      type: 'connect',
      name: 'SERVER',
      message: name + " is connected"
    });
  });
  socket.on('message', function (data) {
    data.name = socket.name;
    console.log(data);
    socket.broadcast.emit('update', data);
  });
  socket.on('disconnect', function () {
    console.log(socket.name + " is disconnected");
    socket.broadcast.emit('update', {
      type: "disconnect",
      name: "SERVER",
      message: socket.name + "is disconnected"
    });
  });
});
server.listen(1234, function () {
  console.log("서버 실행 중");
});