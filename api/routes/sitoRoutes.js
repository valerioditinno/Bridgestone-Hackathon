'use strict';
var controller = require ("../controllers/serverController");
var path = require('path');
var express = require('express');
var router = express.Router();

router.use(function(req, res, next) {
    console.log('SITO %s /sito%s %s', req.method, req.url, req.path);
    next();
});

router.use(express.static(path.join(__dirname, 'public')));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ title: 'Express' });
});

router.get('/maps', function(req, res) {
    res.sendFile(path.join(__dirname + '/view/maps.html'));
});

router.get('/mappasessiones', function(req, res) {
    res.render('mappasessione', { Username: req.query.Username, Session: req.query.Session });
});

router.get('/utenti', function(req, res) {
    res.sendFile(path.join(__dirname + '/view/utenti.html'));
});

router.get('/sessioni', function(req, res) {
    res.sendFile(path.join(__dirname + '/view/sessioni.html'));
});

router.get('/js/jquery',function (req, res) {
    res.sendFile(path.join(__dirname + '/view/js/jquery-3.2.1.min.js'));
});

router.get('/data/json2*',function (req, res) {
    res.sendFile(path.join(__dirname + '/view/data/maps_20170723.json'));
});

router.get('/data/json*',function (req, res) {
    res.sendFile(path.join(__dirname + '/view/data/maps_20170722.json'));
});

module.exports = router;