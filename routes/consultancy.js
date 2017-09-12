var express = require('express');
var api = require('../controllers/ConsultancyCtrl');
var checkAuth = require('../models/checkAuth');
var router = express.Router();

router.post('/list/:id/:mode', checkAuth.forJtable, api.list);
router.post('/list/by_employee/:id/:mode', checkAuth.forJtable, api.listByEmployee);
router.post('/add', checkAuth.forJtable, api.add);
router.put('/update', checkAuth.forJtable, api.update);
router.delete('/delete', checkAuth.forJtable, api.delete);

module.exports = router;