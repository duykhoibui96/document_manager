var account = require('../models/Account');

module.exports = {

    authenticate: function(req, res) {

        var data = req.body;

        account.findOne(data, function(err, doc) {

            if (err) {
                console.log(err);
                res.json({ ret: -1 });
            } else {
                if (doc == null)
                    res.json({ ret: 0 });
                else {
                    res.json({

                        ret: 1,
                        token: doc.EmplID

                    });
                }
            }

        })

    },

    updateInfo: function(req, res) {

        var data = req.body;
        var id = req.id;

        account.findOneAndUpdate({ EmplID: id }, { $set: data }, { new: true }, function(err, doc) {

            if (err) {
                console.log(err);
                res.json({ ret: -1 });
            } else {
                if (doc == null)
                    res.json({ ret: 0 });
                else {
                    console.log(doc);
                    res.json({

                        ret: 1,
                        data: doc

                    });
                }
            }

        })

    }


}