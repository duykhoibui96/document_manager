var Study = require('../models/Study');
var common = require('../models/common');
var fs = require('fs');

module.exports = {

    get: function (req, res) {

        Study.findOne({
            StudyID: req.params.id
        }, function (err, doc) {

            common.forDetails(err, doc, res);

        })

    },

    listForOptions: function (req, res) {


        var selectedObj = req.query.selected;
        Study.find().select(selectedObj).exec(function (err, docs) {

            common.forOptions(err, docs, 'StudyID', 'StudyID Name', res);


        });

    },

    list: function (req, res) {

        var searchObj = {};

        if (req.query.EmplID) {

            if (req.query.Type === 'StudyEmpl')
                searchObj = {

                    StudyEmpl: {
                        $in: [req.query.EmplID]
                    }

                }
            else
                searchObj = {

                    Instructor: {
                        $in: [req.query.EmplID]
                    }

                }
        }

        Study.find(searchObj).exec(function (err, docs) {

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

        if (req.files) {
            console.log('Get here for files');
            var files = req.files;
            var StudyID = req.query.StudyID;
            for (var i = 0; i < files.length; i++)
                files[i].time = Date.now();

            Study.findOneAndUpdate({
                StudyID: StudyID
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
            var newStudy = new Study(req.body);

            newStudy.save(function (err, doc) {

                common.forDetails(err, doc, res);

            })
        }
    },

    update: function (req, res) {

        var idObj = req.query ? req.query : {

            StudyID: req.id

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

        console.log(idObj);
        console.log(updateObj);
        Study.findOneAndUpdate(idObj, updateObj, {
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

        Study.findOne(req.body, function (err, doc) {

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

                Study.remove(req.body, function (err, doc) {

                    common.forDelete(err, doc, res);

                })

            }


        });


    }



};