var express = require('express'),
  app = express(),
  port = process.env.PORT || 3335,

  mongoose = require('mongoose'),
  Task = require('./api/models/serverModel'),
  bodyParser = require('body-parser');
  
  mongoose.Promise = global.Promise;
  mongoose.connect('mongodb://localhost/Tododb'); 


//var loggerModule = require("./logs/loggerModule");
//const logger = loggerModule.getLogger('cheese');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/serverRoutes');
routes(app);


//logger.level = 'debug';
//logger.debug("Some debug messages");

//logger.info("Starting server");
app.listen(port);

//logger.info("Server RUNNING on port: " + port);

console.log('Server started on: ' + port);