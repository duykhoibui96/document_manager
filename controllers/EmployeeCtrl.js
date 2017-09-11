var employee = require('../models/Employee');

var getRidOfKey = function (object) {

    delete object.EmplID;
    return object;

}



var loadInfo = function (id, res) {

    employee.findOne({ EmplID: id }, function (err, doc) {

        if (err) {
            console.log(err);
            res.json({ ret: -1 });
        } else {
            if (doc == null)
                res.json({ ret: 0 });
            else {
                res.json({

                    ret: 1,
                    data: doc

                });
            }
        }

    });

}


module.exports = {

    get: function (req, res) {

        var id = req.query.id ? req.query.id : req.id;

        loadInfo(id, res);

    },

    change: function (req, res) {

        employee.update({ EmplID: req.id }, { $set: req.body }, function (err, docs) {

            if (err) {
                console.log(err);
                res.json({ ret: -1 });
            } else
                loadInfo(req.id, res);


        })


    },

    listAllID: function (req, res) {

        employee.find().select('EmplID Name').exec(function (err, docs) {

            if (err) {
                console.log(err);
                res.json({ Result: 'ERROR', Message: err });
            } else {

                var options = [];
                for(var i=0; i<docs.length; i++)
                    options[i] = {

                        DisplayText: `${docs[i].EmplID} - ${docs[i].Name}`,
                        Value: docs[i].EmplID


                    }
                res.json({

                    Result: 'OK',
                    Options: options

                })
            }


        })

    },


    list: function (req, res) {

        employee.find(function (err, docs) {

            if (err) {
                console.log(err);
                res.json({ Result: 'ERROR', Message: err });
            } else {

                res.json({

                    Result: 'OK',
                    TotalRecordCount: docs.length,
                    Records: docs.slice(req.query.jtStartIndex).slice(0, req.query.jtPageSize)

                })
            }


        })


    },

    add: function (req, res) {

        var newEmployee = new employee(req.body)

        newEmployee.save(function (err, doc) {

            if (err) {
                console.log(err);
                res.json({

                    Result: 'ERROR',
                    Message: 'Database Error'

                })
            } else {
                res.json({

                    Result: 'OK',
                    Record: doc


                })

            }


        })


    },

    update: function (req, res) {

        employee.update(req.body.EmplID, getRidOfKey(req.body), function (err, doc) {

            if (err) {
                console.log(err);
                res.json({

                    Result: 'ERROR',
                    Message: 'Database Error'

                })
            } else {
                res.json({

                    Result: 'OK',
                    Record: doc


                })

            }



        })


    },

    delete: function (req, res) {

        employee.remove(req.body, function (err) {

            if (err)
                console.log(err);

            res.json({

                Result: err ? 'ERROR' : 'OK',
                Message: 'Database Error'


            })


        })


    }

}