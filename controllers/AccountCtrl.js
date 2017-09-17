var account = require('../models/Account');

module.exports = {

    authenticate: function (req, res) {

        var data = req.body;

        account.findOne(data).select('EmplID Username').exec(function(err, doc){

            if (err) {
                console.log(err);
                res.json({ Result: 'ERROR' , Message: 'Database error'});
            } else {
                if (doc == null)
                    res.json({ Result: 'ERROR', Message: 'Invalid username or password' });
                else {
                    res.json({

                        Result: 'OK',
                        Record: doc

                    });
                }
            }

        })

    },

    update: function (req, res) {

        var data = req.body;
        var id = req.id;

        account.findOneAndUpdate({ EmplID: id }, { $set: data }, { new: true }, function (err, doc) {

            if (err) {
                console.log(err);
                res.json({ Result: 'ERROR' });
            } else {

                res.json({

                    Result: 'OK',
                    Record: doc

                });

            }

        })

    }


}