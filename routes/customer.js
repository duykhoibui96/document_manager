var express = require('express');
var api = require('../controllers/CustomerCtrl');
var checkAuth = require('../models/checkAuth');
var router = express.Router();

router.get('/all', checkAuth.forJtable, api.list);
router.post('/all-id', api.listAllID);
router.get('/all/by_employee', checkAuth.forJtable, api.listByEmployee);
router.post('/add', checkAuth.forJtable, api.add);
router.put('/update', checkAuth.forJtable, api.update);
router.delete('/delete', checkAuth.forJtable, api.delete);

module.exports = router;