'use strict';
var controller = require ("../controllers/serverController");
var path = require('path');
var view = require(__dirname + '/view/view.js');
var express = require('express');

module.exports = function(app) {
/*
    router.use(function(req, res, next) {
        console.log('%s %s %s', req.method, req.url, req.path);
        next();
    });
*/
    app.use(express.static(path.join(__dirname, 'public')));
    app.set('view engine', 'html');
    app.use( '/site/', view);

    app.get('/', function (req, res) {
        res.send(test(req));
    });

    app.get('/listusers', function(req, res){
        controller.list_all_users(req, res);
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
    
    app.get('/sessionDetail', function(req,res){
        controller.sessionDetail(req,res);
    });

    app.get('/usersessions', function(req,res){
        controller.userSessions(req,res);
    });

    app.get('/maps', function(req, res) {
        res.sendFile(path.join(__dirname + '/view/maps.html'));
    });

    app.get('/mappasessiones', function(req, res) {
        res.redirect('/routes/view/mappasessione.html' + '?Session=23&Username=daniele');
    });

    app.get('/utenti', function(req, res) {
        res.sendFile(path.join(__dirname + '/view/utenti.html'));
    });

    app.get('/sessioni', function(req, res) {
        res.sendFile(path.join(__dirname + '/view/sessioni.html'));
    });

    app.get('/js/jquery',function (req, res) {
        res.sendFile(path.join(__dirname + '/view/js/jquery-3.2.1.min.js'));
    });

    app.get('/data/json2*',function (req, res) {
        res.sendFile(path.join(__dirname + '/view/data/maps_20170723.json'));
    });

    app.get('/data/json*',function (req, res) {
        res.sendFile(path.join(__dirname + '/view/data/maps_20170722.json'));
    });

    app.post('/login',function (req, res) {
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