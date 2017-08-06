'use strict';
var controller = require ("../controllers/serverController");
var path = require('path');

module.exports = function(app) {
/*
    router.use(function(req, res, next) {
        console.log('%s %s %s', req.method, req.url, req.path);
        next();
    });
*/
    app.get('/', function (req, res) {
        res.send(test(req));
    });

    app.get('/listusers', function(req, res){
        controller.list_all_tasks(req, res);
    });
    
    app.post('/', function (req, res) {
        res.send(test(req));
    });

    app.post('/createtask', function(req, res){
        res.send(create_a_task(req, res));
    });
    
    app.post('/addinfo', function(req,res){
        controller.create_a_task(req,res);
    });

    app.get('/maps', function(req, res) {
        res.sendFile(path.join(__dirname + '/view/maps.html'));
    });

    app.get('/js/jquery',function (req, res) {
        res.sendFile(path.join(__dirname + '/view/js/jquery-3.2.1.min.js'));
    });

    app.get('/data/json*',function (req, res) {
        res.sendFile(path.join(__dirname + '/view/data/maps_20170722.json'));
    });

    app.post('/login',function (req, res) {
        console.log('login');
        controller.login(req, res);
    });
};

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