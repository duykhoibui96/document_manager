var Employee = require('../models/Employee');
var common = require('../models/common');

module.exports = {

    get: function (req, res) {

        Employee.findOne({ EmplID: req.params.id }, function (err, doc) {

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


        Employee.find().exec(function (err, docs) {

            common.forList(err, docs, req, res);

        })

    },

    create: function (req, res) {

        var newEmployee = new Employee(req.body);

        newEmployee.save(function (err, doc) {

            common.forDetails(err, doc, res);

        })


    },

    update: function (req, res) {

        var idObj = req.query ? req.query : {

            EmplID: req.id

        };

        Employee.findOneAndUpdate(idObj, req.body, { new: true }, function (err, doc) {

            common.forDetails(err, doc, res);

        })

    },

    delete: function (req, res) {

        Employee.remove(req.body, function (err, doc) {

            common.forDelete(err, doc, res);

        })

    }


}