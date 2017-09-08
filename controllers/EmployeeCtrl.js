var employee = require('../models/Employee');

var loadInfo = function(id, res) {

    employee.findOne({ EmplID: id }, function(err, doc) {

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

    getInfo: function(req, res) {

        var id = req.query.id ? req.query.id : req.id;

        loadInfo(id, res);

    },

    changeInfo: function(req, res) {

        employee.update({ EmplID: req.id }, { $set: req.body }, function(err, docs) {

            if (err) {
                console.log(err);
                res.json({ ret: -1 });
            } else
                loadInfo(req.id, res);


        })


    },

    getAllInfo: function(req, res) {

        employee.find(function(err, docs) {

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

    addEmployee: function(req, res) {

        var newEmployee = new employee(req.body)

        newEmployee.save(function(err, doc) {

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

    updateEmployee: function(req, res) {

        employee.update(req.query.EmplID, req.body, function(err, doc) {

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

    deleteEmployee: function(req, res) {


        employee.remove({ EmplID: req.query.EmplID == 'null' ? '' : req.query.EmplID  }, function(err) {

            if (err)
                console.log(err);

            res.json({

                Result: err ? 'ERROR' : 'OK',
                Message: 'Database Error'


            })


        })


    }

}