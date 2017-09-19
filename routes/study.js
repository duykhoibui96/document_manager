var express = require('express');
var multer = require('multer');
var api = require('../controllers/StudyCtrl');
var checkAuth = require('../models/checkAuth');
var router = express.Router();

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log('destination');
        cb(null, './data');
    },
    filename: function (req, file, cb) {
        var filename = file.originalname;
        var filenames = filename.split('.');
        filenames[0] = filenames[0] + '-' + Date.now();
        filename = filenames.join('.');
        cb(null, filename);
    }
});

var upload = multer({ storage: storage }).any();

router.post('/file', function(req,res){
    upload(req,res,function(err) {
        if(err) {
            console.log(err)
            res.end('Error');
        }
        else
        {
            api.create(req,res);
        }
    });
});

router.get('/details/:id',checkAuth.commonReq, api.get);
router.post('/options',api.listForOptions);
router.get('/',checkAuth.jtableReq,api.list);
router.post('/',checkAuth.jtableReq,api.create);
router.put('/',checkAuth.jtableReq,api.update);
router.delete('/',checkAuth.jtableReq,api.delete);

module.exports = router;