'use strict';


var mongoose = require('mongoose'), 
    moment = require('moment');

var Task = mongoose.model('Tasks');
var TaskAvg = mongoose.model('TasksAvg');
var User = mongoose.model('Users');
var Session = mongoose.model('Sessions');
var request = require('request');

var regex_avg_gps = /\[.{1,60}\]/gm;
var separatorData = " - ";

//global.regex_avg_gps = /\[.{1,60}\]/gm;
//var DataFromPhone = mongoose.model('DataFromPhones');

exports.list_all_tasks = function(req, res) {
  Task.find({}, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};

exports.list_all_tasksavg = function(req, res) {
  TaskAvg.find({}, function(err, taskavg) {
    if (err)
      res.send(err);
    res.json(taskavg);
  });
};

exports.list_all_users = function(req, res) {
  User.find({}, function(err, users) {
    if (err)
      res.send(err);
    res.json(users);
  });
};

exports.login = function(req, res) {
  var message = "";
  var time = moment();
  var time_format = time.format('X');
  User.findOne({ "Username" : req.body.Username}, function(err, user) {
    console.log('login: ' + req.body.Username);
    if (err)
      message = err;
    else{
      if(typeof req.body.Password !== 'undefined' && user != null && req.body.Password == user.Password){
        message = "OK " + time_format;
        var session = new Session({"Username": user.Username, "Timestamp": time_format});
        session.save(function(err, session_res) {
        });
      }else{
        message = "KO";
      }
    }
    res.send(message);
  });
};

exports.loginSite = function(req, res) {
  var messagestr = "";
  var resultnum = 0;
  var sessionval = "";
  var time = moment();
  var time_format = time.format('x');  
  User.findOne({ "Username" : req.body.Username}, function(err, user) {
    if (err)
      messagestr = err;
    else{
      if(typeof req.body.Password !== 'undefined' && user != null && req.body.Password == user.Password){
        messagestr = "OK"
        sessionval = time_format;
        var session = new Session({"Username": user.Username, "Timestamp": time_format, "Site": true});
          session.save(function(err, session_res) {
        });
      }else{
        resultnum = -1;
        messagestr = "Username or password is incorrect";
      }
    }
    res.json({result: resultnum, message: messagestr, session: sessionval, success: (resultnum == 0) ? true : false});
  });
};

exports.userSessions = function(req, res) {
  console.log(req.query.Username);
  Session.find({"Username": req.query.Username}, function(err, sessions) {
    if (err)
      res.send(err);
      for(var i = 0; i< sessions.length; i++){
        if(!sessions[i].Site){
          var start_point = null;
          var end_point = null;
          var first_step = TaskAvg.findOne({Session : sessions[i].Timestamp}, {}, { sort: { 'created_at' : -1 } }, function(err, post) {
            if(post !== null){
              testAsync(post);
            }
          });
          
          var last_step = TaskAvg.findOne({Session : sessions[i].Timestamp}, {}, { sort: { 'created_at' : 1 } }, function(err, post) {
            if(post !== null){
            }
          });
        }
        function testAsync(data){
          console.log("test async");
          console.log(data);
          console.log(sessions[i]);
        }
      }
            

      res.json(sessions);
  });
};


exports.create_a_task = function(req, res) { 
  var new_task = new Task(req.body);
  console.log(new_task);
  extractTaskAvg (req.body);
  new_task.save(function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};

exports.create_a_task_by_name = function(name, res) {
  var new_task = new Task(name);
  new_task.save(function(err, task) {
    if (err){
      res.send(err);
    }
    console.log (task);
    //res.json(task);
  });
};

exports.read_a_task = function(req, res) {
  Task.findById(req.params.taskId, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};


exports.update_a_task = function(req, res) {
  Task.findOneAndUpdate({_id: req.params.taskId}, req.body, {new: true}, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};


exports.delete_a_task = function(req, res) {
  Task.remove({
    _id: req.params.taskId
  }, function(err, task) {
    if (err)
      res.send(err);
    res.json({ message: 'Task successfully deleted' });
  });
};

exports.create_user = function(req, res){
  var new_user = new User(req.body);
  new_user.save(function(err, user) {
    if (err)
      res.send(err);
    res.json(user);
  });
};

exports.add_data_from_phone = function(req, res){
  var data_from_phone = new DataFromPhone(req.body);
  data_from_phone.save(function(err, data) {
    if (err)
      res.send(err);
    res.json(data);
  });
};

exports.sessionDetail = function(req, res) {
  console.log(req.query.Username);
  TaskAvg.find({"UserID": req.query.Username, "Session": req.query.Session}, function(err, taskavg) {
    if (err)
      res.send(err);
    res.json(taskavg);
  });
};

function extractTaskAvg(task){
    var data = task.Data;
    var tasksList = data.match(regex_avg_gps); 
    if(tasksList != null){
      for(var i = 0; i<tasksList.length; i++){
        console.log('test regex_avg_gps data');
        console.log(tasksList[i]);
        var temp_i = tasksList[i].substr(1, tasksList[i].length-2);
        var res = temp_i.split(separatorData);
        if(res.length = 3){
          var coords_temp = res[1].substr(1, res[1].length-2);
          var coords = coords_temp.split(", ");
          var lnglat = res[2].split(", ");
          var taskAvg = new TaskAvg({
            x: coords[0],
            y: coords[1],
            z: coords[2],
            lat: lnglat[0],
            lng: lnglat[1],
            Timestamp : res[0],
            UserID : task.UserID,
            Session : task.Session
          });
          taskAvg.save(function(err, task) {
            if (err){
              console.log("error " + err);
            }else{
              updateSessionInfo(task);
            }
          });
        }
      }
    }
}

function updateSessionInfo(taskAvg, new_errors = 0){
  console.log("- " + taskAvg.Session + " - " +taskAvg.UserID);
  Session.findOne({Session: taskAvg.Session, Username: taskAvg.UserID}, function(err, session) {
    if(session.first_update === "-1"){
      session.first_update = taskAvg.Timestamp;
      session.lat_start = taskAvg.lat;
      session.lng_start = taskAvg.lng;
    }else{
      var old_distance = session.total_distance;
      var old_score = session.score;
      var old_error = session.error;
      var distance_to_add = distance(session.lat_start, session.lng_start, taskAvg.lat, taskAvg.lng, "K");
      session.total_distance = old_distance + distance_to_add;
      session.error = old_error + new_errors;
      session.score = old_score + distance_to_add - (new_errors * 0.5);
    }
    session.lat_end = taskAvg.lat;
    session.lng_end = taskAvg.lng;
    session.last_update = taskAvg.Timestamp;
      
    Session.findOneAndUpdate({Session: taskAvg.Session, Username: UserID}, session, {new: true}, function(err, newsession) {
      if(err){
        console.log(err);
      }else{
        console.log('aggioranto');
        console.log(newsession);
      }
    });
  });
}


function distance(lat1, lon1, lat2, lon2, unit) {
  var radlat1 = Math.PI * lat1/180
  var radlat2 = Math.PI * lat2/180
  var theta = lon1-lon2
  var radtheta = Math.PI * theta/180
  var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist)
  dist = dist * 180/Math.PI
  dist = dist * 60 * 1.1515
  if (unit=="K") { dist = dist * 1.609344 }
  if (unit=="N") { dist = dist * 0.8684 }
  return dist
}


function get_geolcode(lat, lng, callback) {
    var options = {
        uri : 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng +'&key=AIzaSyDh2ZoqiOa5x4N43XJoIWZOc__7MvHPa7I',
        method : 'GET'
    }; 
    var res = '';
    console.log(options.uri);
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res = body;
        }
        else {
            res = {
              "results" : [],
              "status" : "ZERO_RESULTS_WITH_ERROR"
            };
        }
        callback(res);
    });
}
