'use strict';
var controller = require ("../controllers/serverController");
var path = require('path');
var express = require('express');
var router = express.Router();
const uuidv1 = require('uuid/v1');


var uuid = uuidv1();
router.use(function(req, res, next) {
    console.log('[%s][API][%s][INFO][%s] - %s', new Date().toISOString(), uuid, req.method, req.url);
    next();
});

router.use(express.static(path.join(__dirname, 'public')));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/site/');
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
    controller.create_a_task(req,res,uuid);
});

router.get('/sessionDetail', function(req,res){
    controller.sessionDetail(req,res);
});

router.get('/sessionScore', function(req,res){
    controller.sessionScore(req,res);
});

router.get('/usersessions', function(req,res){
    controller.userSessions(req,res);
});

router.post('/login',function (req, res) {
    controller.login(req, res);
});

router.get('/ranking',function (req, res) {
    controller.ranking(req, res);
});

router.get('/myposition',function (req, res) {
    controller.myposition(req, res);
});

router.post('/loginSite',function (req, res) {
    controller.loginSite(req, res);
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