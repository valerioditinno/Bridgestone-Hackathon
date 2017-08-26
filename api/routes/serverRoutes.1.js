'use strict';
var controller = require ("../controllers/serverController");
var path = require('path');
var express = require('express');
var router = express.Router();

router.use(function(req, res, next) {
    console.log('%s %s %s', req.method, req.url, req.path);
    next();
});

router.use(express.static(path.join(__dirname, 'public')));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ title: 'Express' });
});

router.get('/', function (req, res) {
    res.send(test(req));
});

router.get('/listusers', function(req, res){
    controller.list_all_users(req, res);
});

router.post('/', function (req, res) {
    res.send(test(req));
});

router.post('/createtask', function(req, res){
    res.send(create_a_task(req, res));
});

router.post('/addinfo', function(req,res){
    controller.create_a_task(req,res);
});

router.get('/sessionDetail', function(req,res){
    controller.sessionDetail(req,res);
});

router.get('/usersessions', function(req,res){
    controller.userSessions(req,res);
});

router.post('/login',function (req, res) {
    controller.login(req, res);
});

module.exports = router;

function test(req){
    console.log ("ecco una POST");
   // console.log(req.body);  
    console.log(req.params);
    console.log ("ecco una");
    //logger.info("test");
    return "hello";
    controller.create_a_task(req);
}

function create_a_task(req, res){
    console.log(req.body);
    controller.create_a_task_by_name(req.body, res);
    return "done";
}