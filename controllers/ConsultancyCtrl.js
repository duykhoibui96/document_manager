var Consultancy = require('../models/Consultancy');
var common = require('../models/common');
var fs = require('fs');



module.exports = {

    get: function (req, res) {

        Consultancy.findOne({
            ConsID: req.params.id
        }, function (err, doc) {

            common.forDetails(err, doc, res);

        })

    },


    list: function (req, res) {

        var searchObj = {};

        if (req.query.CustomerID)
            searchObj = {

                CustomerID: req.query.CustomerID

            }
        else if (req.query.ConsultingEmplID)
            searchObj = {

                ConsultingEmplID: req.query.ConsultingEmplID

            }
        else if (req.query.ConsultedEmplID)
            searchObj = {

                ConsultedEmplID: req.query.ConsultedEmplID

            }
        console.log(searchObj);

        Consultancy.find(searchObj).exec(function (err, docs) {

            if (req.query.start)
            {
                var startDate = new Date(Number(req.query.start));
                var endDate = new Date(Number(req.query.end));
                console.log(req.query);

                docs = docs.filter(function(doc){

                    var time = new Date(doc.Time.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
                    console.log(startDate);
                    console.log(time);
                    console.log(endDate);
                    return startDate <= time && time <= endDate;

                })
            }
            common.forList(err, docs, req, res);

        })

    },

    create: function (req, res) {

        if (req.files) {
            var files = req.files;
            var ConsID = req.query.ConsID;
            for (var i = 0; i < files.length; i++)
                files[i].time = Date.now();

            Consultancy.findOneAndUpdate({
                ConsID: ConsID
            }, {
                $pushAll: {
                    Document: req.files
                }
            }, {
                new: true
            }, function (err, doc) {

                common.forDetails(err, doc, res);

            })

        } else {
            // req.body.Time = new Date(req.body.Time.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
            var newConsultancy = new Consultancy(req.body);

            newConsultancy.save(function (err, doc) {

                common.forDetails(err, doc, res);

            })
        }


    },

    update: function (req, res) {

        var idObj = req.query ? req.query : {

            ConsID: req.id

        };

        var updateObj = req.body;

        if (req.body.time)
            updateObj = {

                $pop: {
                    Document: req.body
                }

            }
        // else if (req.body.Time)
        //     req.body.Time = new Date(req.body.Time.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));

        console.log('Here it is');
        console.log(req.body.Time);
        console.log(req.body);
        console.log(idObj);
        Consultancy.findOneAndUpdate(idObj, updateObj, {
            new: true
        }, function (err, doc) {

            if (req.body.path)
                fs.unlink(req.body.path, function (err) {

                    if (err)
                        console.log(err);

                });
            common.forDetails(err, doc, res);

        })

    },

    delete: function (req, res) {

        Consultancy.findOne(req.body, function (err, doc) {

            if (err) {
                console.log(err);
                res.json({
                    Result: 'ERROR',
                    Message: 'Database error'
                })
            } else if (doc == null) {
                res.json({
                    Result: 'OK'
                })
            } else {

                if (doc != null)
                    doc.Document.forEach(function (item) {

                        fs.unlink(item.path, function (err) {

                            if (err)
                                console.log(err);

                        });

                    });

                Consultancy.remove(req.body, function (err, doc) {

                    common.forDelete(err, doc, res);

                })

            }


        });

    }


}