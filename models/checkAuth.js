module.exports = {


    commonReq: function(req, res, next) {

        var token = req.headers['token'];

        if (token === undefined) {
            console.log('Forbidden');
            res.status(403).send('Forbidden');
        } else {
            req.id = Number(token);
            next();
        }
    },

    jtableReq: function(req,res,next) {

    	var token = req.headers['token'];

        if (token === undefined) {
            console.log('Forbidden');
            res.json({

            	Result: 'ERROR',
            	Message: 'You have no permission to use this functionality'


            })
        } else {
            req.id = Number(token);
            delete req.body.token;
            next();
        }


    }


}