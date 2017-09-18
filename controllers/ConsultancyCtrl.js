var Consultancy = require('../models/Consultancy');
var common = require('../models/common');
var fs = require('fs');



module.exports = {

    get: function (req, res) {

        Consultancy.findOne({ ConsID: req.params.id }, function (err, doc) {

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
        else if (req.query.start)
            searchObj = {

                Time: {"$gte": new Date(Number(req.query.start)), "$lt": new Date(Number(req.query.end))}

            }

        console.log(searchObj);

        Consultancy.find(searchObj).exec(function (err, docs) {

            common.forList(err, docs, req, res);

        })

    },

    create: function (req, res) {

        if (req.files) 
        {
            var files= req.files;
            var ConsID = req.query.ConsID;
            for(var i = 0; i<files.length; i++)
                files[i].time = Date.now();

            Consultancy.findOneAndUpdate({ ConsID: ConsID }, { $pushAll: { Document: req.files }},{ new: true }, function(err,doc){

                common.forDetails(err,doc,res);

            })

        }
        else {
            req.body.Time = new Date(req.body.Time.replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3") );
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
            updateObj= {

                $pop: { Document: req.body }

            }

        console.log(req.body);

        Consultancy.findOneAndUpdate(idObj, updateObj, { new: true }, function (err, doc) {

            if (req.body.path)
                fs.unlink(req.body.path);
            common.forDetails(err, doc, res);

        })

    },

    delete: function (req, res) {

        Consultancy.remove(req.body, function (err, doc) {

            common.forDelete(err, doc, res);

        })

    }


}