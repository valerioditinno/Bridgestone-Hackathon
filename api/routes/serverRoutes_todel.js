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
        res.redirect("/site/");
    });

    app.get('/listusers', function(req, res){
        controller.list_all_users(req, res);
    });
    
    app.post('/', function (req, res) {
        res.redirect("/site/");
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

    app.post('/login',function (req, res) {
        controller.login(req, res);
    });
};

function create_a_task(req, res){
    console.log(req.body);
    controller.create_a_task_by_name(req.body, res);
    return "done";
}