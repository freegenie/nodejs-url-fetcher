// SERVER

var io = require('socket.io'), 
    fs = require('fs'), 
    util = require('util'); 

// This is interesting, attach socket io to an 
// express instance, in the case we need to server 
// web resources with node. 
var app = require('express').createServer(), 
    io = io.listen(app); 

// start the app
app.listen(8080); 

// we'll not need these in production, I'm just simulating pages
app.get('/jquery.js', function(req, res) {
  var jquery = fs.readFileSync('./jquery-1.6.2.min.js').toString(); 
  res.writeHead(200,{'Content-Type' : 'text/javascript'}); 
  res.write(jquery); 
  res.end();
}); 

app.get('/vimeo.html', function(req, res) {
  var page = fs.readFileSync('./vimeo.html').toString(); 
  res.writeHead(200,{'Content-Type' : 'text/html'}); 
  res.write(page); 
  res.end();
}); 

app.get('/', function(req, res) {
  var page = fs.readFileSync('./client.html').toString(); 
  res.writeHead(200,{'Content-Type' : 'text/html'}); 
  res.write(page); 
  res.end();
}); 


var urlfetch = io.of('/ws/urlfetch')
  .on('connection', function (socket) {

    socket.on('set_auth', function (data) {
      // use data to check for auth, and set 
      // 'session' session variable on the socket itself
      // 
      // - code to check token goes here, it has to enclose
      //   the following lines
      // 
      // if authorization passes, set a session variable on the 
      // socket. 
      socket.set('session', { authorized : true }, function() {
        socket.emit('ready');
      }); 
      // if authorization does not pass, we never emit 'ready' 
      // and never set { authorized : true } on session
    });

    socket.on('urlfetch', function (data) {
     socket.get('session', function(err, session) {
       if (session.authorized) {

         // - code to fetch the page goes here, it's going 
         //   to enclose the emit function once it's done. 

         socket.emit('urlfetch_response', { 
           title : 'Star Wars',
           description : 'Best movie in the world', 
           url : data.url  
         });

       } // end if 
     });
   });

});

