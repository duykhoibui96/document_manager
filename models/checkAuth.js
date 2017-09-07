module.exports = function(req, res, next) {

    var token = req.headers['token'];

    if (token === undefined){
    	console.log('Forbidden');
        res.status(403).send('Forbidden');
    }
    else {
        req.id = Number(token);
        next();
    }
}

