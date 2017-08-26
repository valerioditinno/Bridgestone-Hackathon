'use strict';


var mongoose = require('mongoose'), 
    moment = require('moment');

var Task = mongoose.model('Tasks');
var TaskAvg = mongoose.model('TasksAvg');
var User = mongoose.model('Users');
var Session = mongoose.model('Sessions');

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

exports.userSessions = function(req, res) {
  console.log(req.query.Username);
  Session.find({"Username": req.query.Username}, function(err, sessions) {
    if (err)
      res.send(err);
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

function extractTaskAvg(task){
    var data = task.Data;
    var tasksList = data.match(regex_avg_gps); // id = 'Ahg6qcgoay4'
    console.log(tasksList);
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
          if (err)
            console.log("error " + err);
        });
      }
    }
}