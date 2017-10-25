'use strict';
var controller = require ("../controllers/serverController");
var path = require('path');
var express = require('express');
var router = express.Router();
const uuidv1 = require('uuid/v1');


var uuid = uuidv1();
router.use(function(req, res, next) {
    uuid = uuidv1();
    console.log('[%s][API][%s][INFO][%s] - %s', new Date().toISOString(), uuid, req.method, req.url);
    next();
});

router.use(express.static(path.join(__dirname, 'public')));

/* GET api page. */
router.get('/', function(req, res, next) {
  res.render('api.html');
});

module.exports = router;
