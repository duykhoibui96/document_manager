var Employee = require('../models/Employee');
var common = require('../models/common');
var Study = require('../models/Study');

module.exports = {

    get: function (req, res) {

        Employee.findOne({
            EmplID: req.params.id
        }, function (err, doc) {

            common.forDetails(err, doc, res);

        })

    },

    listForOptions: function (req, res) {

        var selectedObj = req.query.selected;
        Employee.find().select(selectedObj).exec(function (err, docs) {

            common.forOptions(err, docs, 'EmplID', 'EmplID Name', res);


        });

    },


    list: function (req, res) {

        if (req.query.StudyID) {

            Study.findOne({
                StudyID: req.query.StudyID
            }, function (err, doc) {

                if (err) {
                    console.log(err);
                    res.json({
                        Result: 'ERROR',
                        Message: 'Database error'
                    });
                } else if (doc == null) {
                    res.json({
                        Result: 'ERROR',
                        Message: 'Record was deleted'
                    });
                } else {
                    Employee.find({
                        EmplID: {
                            $in: req.query.Type === 'Study' ? doc.StudyEmpl : doc.Instructor
                        }
                    }, function (err, docs) {

                        common.forList(err, docs, req, res);

                    })
                }

            })

        } else {
            var searchObj = {};

            if (req.query.text) {
                if (req.query.cat === 'EmplID')
                    searchObj = {

                        EmplID: Number(req.query.text)

                    }
                else
                    searchObj = {

                        Name: {
                            "$regex": req.query.text,
                            "$options": "i"
                        }

                    }

            }

            console.log(searchObj);

            Employee.find(searchObj).exec(function (err, docs) {

                common.forList(err, docs, req, res);

            })
        }

    },

    create: function (req, res) {

        if (req.query.StudyID) {

            var employeeObj = req.query.Type === 'Study' ? {

                StudyEmpl: req.body.EmplID

            } : {

                Instructor: req.body.EmplID

            };

            Study.findOneAndUpdate({
                StudyID: req.query.StudyID
            }, {
                $push: employeeObj
            }, {
                new: true
            }, function (err, doc) {

                if (err) {
                    console.log(err);
                    res.json({
                        Result: 'ERROR',
                        Message: 'Database error'
                    });
                } else if (doc == null) {
                    res.json({
                        Result: 'ERROR',
                        Message: 'Record was deleted'
                    });
                } else {
                    Employee.findOne({
                        EmplID: req.body.EmplID
                    }, function (err, doc) {

                        common.forDetails(err, doc, res);

                    })
                }


            })

        } else {
            var newEmployee = new Employee(req.body);

            newEmployee.save(function (err, doc) {

                common.forDetails(err, doc, res);

            })
        }


    },

    update: function (req, res) {


        var idObj = req.query ? req.query : {

            EmplID: req.id

        };

        console.log(req.body);

        Employee.findOneAndUpdate(idObj,req.body, {
            new: true
        }, function (err, doc) {

            common.forDetails(err, doc, res);

        })

    },

    delete: function (req, res) {

        if (req.query.StudyID) {

            var employeeObj = req.query.Type === 'Study' ? {

                StudyEmpl: req.body.EmplID

            } : {

                Instructor: req.body.EmplID

            };

            Study.findOneAndUpdate({
                StudyID: req.query.StudyID
            }, {
                $pop: employeeObj
            }, function (err, doc) {

                if (err) {
                    console.log(err);
                    res.json({
                        Result: 'ERROR',
                        Message: 'Database error'
                    });
                } else
                    res.json({

                        Result: 'OK'

                    })


            })

        } else
            Employee.remove(req.body, function (err, doc) {

                common.forDelete(err, doc, res);

            })

    }


}