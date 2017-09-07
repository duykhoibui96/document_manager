var express = require('express');
var router = express.Router();

/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/

router.head('/check',function(req,res){

	console.log('Connection checked');
	res.status(202).send();

})

module.exports = router;
