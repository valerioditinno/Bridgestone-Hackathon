var express = require('express'),
  app = express(),
  port = process.env.PORT || 3336,
  mongoose = require('mongoose'),
  Task = require('./api/models/serverModel'),
  index = require('./index'),
  routes = require('./api/routes/serverRoutes.1'),
  routersito = require('./api/routes/sitoRoutes'),
  bodyParser = require('body-parser'),
  path = require('path'),
  engines = require('consolidate');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Tododb'); 

//Creating Router() object

var router = express.Router();
// Router middleware, mentioned it before defining routes.

router.use(function(req,res,next) {
  console.log("/" + req.method);
  next();
});

// dico all'app dove sono le view
app.set('views', path.join(__dirname, 'public'));
app.engine('html', engines.mustache);
// e in che formato sono
app.set('view engine', 'html');
 
// dico all'app di servire tutto il contenuto della cartella 'public' come statico
app.use(express.static(path.join(__dirname, 'public')));


app.use("/sito", routersito);
//app.use("/public", router);
app.use("/", routes);
/*
app.use("*",function(req,res){
  res.sendFile(__dirname + "/public/404.html");
});
*/

// Listen to this Port

app.listen(port);
console.log('Server started on: ' + port);



/*
var express = require('express'),
  app = express(),
  port = process.env.PORT || 3336,

  mongoose = require('mongoose'),
  Task = require('./api/models/serverModel'),
  index = require('./index'),
  routes = require('./api/routes/serverRoutes'),
  bodyParser = require('body-parser');
  
  mongoose.Promise = global.Promise;
  mongoose.connect('mongodb://localhost/Tododb'); 


//var loggerModule = require("./logs/loggerModule");
//const logger = loggerModule.getLogger('cheese');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/View'));
app.set('views', __dirname + '/View');
//Store all HTML files in view folder.
app.use(express.static(__dirname + '/Script'));
//Store all JS and CSS in Scripts folder.
app.set('view engine', 'html');
app.use('/', index);
app.use('/api', routes);

//logger.level = 'debug';
//logger.debug("Some debug messages");

//logger.info("Starting server");
app.listen(port);

//logger.info("Server RUNNING on port: " + port);

console.log('Server started on: ' + port);*/