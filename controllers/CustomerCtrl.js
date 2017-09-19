var Customer = require('../models/Customer');
var Employee = require('../models/Employee');
var Consultancy = require('../models/Consultancy');
var common = require('../models/common');

module.exports = {

    get: function (req, res) {

        Customer.findOne({
            CustomerID: req.params.id
        }, function (err, doc) {

            common.forDetails(err, doc, res);

        })

    },

    listForOptions: function (req, res) {


        var selectedObj = req.query.selected;
        Customer.find().select(selectedObj).exec(function (err, docs) {

            common.forOptions(err, docs, 'CustomerID', 'CustomerID Name', res);


        });

    },

    list: function (req, res) {

        if (req.query.CustomerID) {
            Customer.findOne({
                CustomerID: req.query.CustomerID
            }, function (err, doc) {

                if (err) {
                    console.log(err);
                    res.json({

                        Result: 'ERROR',
                        Message: 'Database error'

                    })
                } else
                if (doc == null)
                    res.json({

                        Result: 'ERROR',
                        Message: 'This customer is not existed in database'

                    })
                else
                    Employee.find({
                        EmplID: {
                            $in: doc.ResponsibleEmpl
                        }
                    }, function (err, docs) {

                        common.forList(err, docs, req, res);

                    })

            })
        } else if (req.query.EmplID) {
            Customer.find({
                ResponsibleEmpl: {
                    $in: [req.query.EmplID]
                }
            }).exec(function (err, docs) {

                common.forList(err, docs, req, res);

            })

        } else {

            var searchObj = {};

            if (req.query.text) {
                if (req.query.cat === 'CustomerID')
                    searchObj = {

                        CustomerID: Number(req.query.text)

                    }
                else
                    searchObj = {

                        Name: {
                            "$regex": req.query.text,
                            "$options": "i"
                        }

                    }

            }



            Customer.find(searchObj).exec(function (err, docs) {

                common.forList(err, docs, req, res);

            })
        }



    },

    create: function (req, res) {

        if (req.query.CustomerID) {

            Customer.findOneAndUpdate({
                CustomerID: req.query.CustomerID
            }, {
                $push: {
                    ResponsibleEmpl: req.body.EmplID
                }
            }, function (err, doc) {

                if (err) {
                    console.log(err);
                    res.json({

                        Result: 'ERROR',
                        Message: 'Database error'

                    })
                } else
                    Employee.findOne(req.body, function (err, doc) {

                        common.forDetails(err, doc, res);

                    })

            })

        } else if (req.query.EmplID) {
            Customer.findOneAndUpdate(req.body, {
                $push: {
                    ResponsibleEmpl: req.query.EmplID
                }
            }, {
                new: true
            }).exec(function (err, doc) {

                common.forDetails(err, doc, res);

            })

        } else {
            var newCustomer = new Customer(req.body);

            newCustomer.save(function (err, doc) {

                common.forDetails(err, doc, res);

            })
        }


    },

    update: function (req, res) {

        var idObj = req.query ? req.query : {

            CustomerID: req.id

        };

        Customer.findOneAndUpdate(idObj, req.body, {
            new: true
        }, function (err, doc) {

            common.forDetails(err, doc, res);

        })

    },

    delete: function (req, res) {

        if (req.query.CustomerID) {

            Customer.findOneAndUpdate({
                CustomerID: req.query.CustomerID
            }, {
                $pop: {
                    ResponsibleEmpl: req.body.EmplID
                }
            }, function (err, doc) {

                if (err) {
                    console.log(err);
                    res.json({

                        Result: 'ERROR',
                        Message: 'Database error'

                    })
                } else
                    res.json({

                        Result: 'OK'

                    })

            })

        } else if (req.query.EmplID) {
            Customer.findOneAndUpdate(req.body, {
                $pop: {
                    ResponsibleEmpl: req.query.EmplID
                }
            }, function (err, doc) {

                if (err) {
                    console.log(err);
                    res.json({

                        Result: 'ERROR',
                        Message: 'Database error'

                    })
                } else
                    res.json({

                        Result: 'OK'

                    })

            })
        } else
            Customer.remove(req.body, function (err, doc) {

                common.forDelete(err, doc, res);

            })

    }


}