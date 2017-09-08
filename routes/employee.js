var express = require('express');
var api = require('../controllers/EmployeeCtrl');
var checkAuth = require('../models/checkAuth');
var router = express.Router();

router.get('/info',checkAuth.forAngular,api.getInfo);
router.get('/all',checkAuth.forJtable,api.getAllInfo);
router.post('/add',checkAuth.forJtable,api.addEmployee);
router.delete('/delete',checkAuth.forJtable,api.deleteEmployee);
router.put('/update',checkAuth.forJtable,api.updateEmployee);
router.put('/info',checkAuth.forAngular,api.changeInfo);

module.exports = router;
