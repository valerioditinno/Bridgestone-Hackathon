var express = require('express'),
  app = express(),
  port = process.env.PORT || 3335
  logger = require('morgan'),
  mongoose = require('mongoose'),
  Task = require('./api/models/serverModel'),
  index = require('./index'),
  routes = require('./api/routes/serverRoutesBase'),
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


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(logger('dev'));
app.set('view engine', 'html');
 
// dico all'app di servire tutto il contenuto della cartella 'public' come statico
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static('public/assets'));
app.use('/site', express.static('public/assets/singular'));
app.use('/oldsite', express.static('public'));


//app.use("/sito", routersito);
//app.use("/public", router);
app.use("/", routes);
/*
app.use("*",function(req,res){
  res.redirect("/site/404.html");
});
*/

// Listen to this Port

app.listen(port);
console.log('Server started on: ' + port);
