var customer = require('../models/Customer');
var common = require('../models/common');

var getRidOfKey = function (object) {

    delete object.CustomerID;
    return object;

}

module.exports = {

    listAllID: function (req, res) {

        customer.find().select('CustomerID Name').exec(function (err, docs) {

            if (err) {
                console.log(err);
                res.json({ Result: 'ERROR', Message: err });
            } else {

                var options = [];
                for (var i = 0; i < docs.length; i++)
                    options[i] = {

                        DisplayText: `${docs[i].CustomerID} - ${docs[i].Name}`,
                        Value: docs[i].CustomerID


                    }
                res.json({

                    Result: 'OK',
                    Options: options

                })
            }


        });

    },
    add: function (req, res) {

        var newCustomer = new customer(req.body);

        newCustomer.save(function (err, doc) {

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


    list: function (req, res) {

        console.log('Hello');
        var filterObj = {};

        var EmplID = Number(req.params.id);
        console.log(EmplID);
        if (!isNaN(EmplID))
            filterObj = {
                
                ResponsibleEmpl: { '$in': [`${EmplID}`] }
                 
            };
        
        console.log(filterObj);

        customer.find(filterObj,function (err, docs) {

            if (err) {
                console.log(err);
                res.json({ Result: 'ERROR', Message: err });
            } else {

                common.filterList(docs,req,res);
            }


        })


    },


    update: function (req, res) {

        customer.update(req.body.CustomerID, getRidOfKey(req.body), function (err, doc) {

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

        customer.remove(req.body, function (err) {

            if (err)
                console.log(err);

            res.json({

                Result: err ? 'ERROR' : 'OK',
                Message: 'Database Error'


            })


        })


    }

}