var Seminar = require('../models/Seminar');
var common = require('../models/common');

module.exports = {

    get: function (req, res) {

        Seminar.findOne({
            SeminarID: req.params.id
        }, function (err, doc) {

            common.forDetails(err, doc, res);

        })

    },

    listForOptions: function (req, res) {


        var selectedObj = req.query.selected;
        Seminar.find().select(selectedObj).exec(function (err, docs) {

            common.forOptions(err, docs, 'SeminarID', 'SeminarID Name', res);


        });

    },

    list: function (req, res) {

        var searchObj = {};
        Seminar.find(searchObj).exec(function (err, docs) {

            if (req.query.start)
            {
                var startDate = new Date(Number(req.query.start));
                var endDate = new Date(Number(req.query.end));

                docs = docs.filter(function(doc){

                    var time = new Date(doc.Time.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
                    return startDate <= time && time <= endDate;

                })
            }
            common.forList(err, docs, req, res);

        })

    },




    create: function (req, res) {

       // req.body.Time = new Date(req.body.Time.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
        var newSeminar = new Seminar(req.body);

        newSeminar.save(function (err, doc) {

            common.forDetails(err, doc, res);

        })
    },

    update: function (req, res) {

        var idObj = req.query ? req.query : {

            SeminarID: req.id

        };

        console.log(req.body);
        //req.body.Time = new Date(req.body.Time.trim().replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
        console.log(req.body);
        console.log(idObj);
        Seminar.findOneAndUpdate(idObj, req.body, {
            new: true
        }, function (err, doc) {

            console.log(doc);
            common.forDetails(err, doc, res);

        })

    },

    delete: function (req, res) {


        Seminar.remove(req.body, function (err, doc) {

            common.forDelete(err, doc, res);

        })

    }



};