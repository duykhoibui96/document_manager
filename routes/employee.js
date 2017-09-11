var express = require('express');
var api = require('../controllers/EmployeeCtrl');
var checkAuth = require('../models/checkAuth');
var router = express.Router();

router.get('/info',checkAuth.forAngular,api.get);
router.post('/get/:id',api.get_reduced);
router.get('/all',checkAuth.forJtable,api.list);
router.post('/all-id',api.listAllID);
router.post('/add',checkAuth.forJtable,api.add);
router.delete('/delete',checkAuth.forJtable,api.delete);
router.put('/update',checkAuth.forJtable,api.update);
router.put('/info',checkAuth.forAngular,api.change);

module.exports = router;
