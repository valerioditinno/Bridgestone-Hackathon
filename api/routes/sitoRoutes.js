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
  res.redirect('utenti');
});

router.get('/mappasessiones', function(req, res) {
    res.render('mappasessione');
});

router.get('/utenti', function(req, res) {
    res.render('utenti');
});

router.get('/sessioni', function(req, res) {
    res.render('sessioni');
});

module.exports = router;