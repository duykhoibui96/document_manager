var express = require('express');
var api = require('../controllers/CustomerCtrl');
var checkAuth = require('../models/checkAuth');
var router = express.Router();

router.get('/details/:id',checkAuth.commonReq, api.get);
router.post('/options',api.listForOptions);
router.get('/',checkAuth.jtableReq,api.list);
router.post('/',checkAuth.jtableReq,api.create);
router.put('/',checkAuth.jtableReq,api.update);
router.delete('/',checkAuth.jtableReq,api.delete);

module.exports = router;