var express = require('express');
var api = require('../controllers/AccountCtrl');
var checkAuth = require('../models/checkAuth');
var router = express.Router();

router.post('/authenticate',api.authenticate);
router.put('/info',checkAuth.forAngular,api.updateInfo);

module.exports = router;