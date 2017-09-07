var express = require('express');
var api = require('../controllers/EmployeeCtrl');
var checkAuth = require('../models/checkAuth');
var router = express.Router();

router.get('/info',checkAuth,api.getInfo);
router.get('/all',checkAuth,api.getAllInfo);
router.put('/info',checkAuth,api.changeInfo);

module.exports = router;
