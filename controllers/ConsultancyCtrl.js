var consultancy = require('../models/Consultancy');
var common = require('../models/common');

var getRidOfKey = function (object) {

    delete object.ConsID;
    return object;

}

module.exports = {

    list: function (req, res) {

        var EmplID = Number(req.params.id);
        var mode = req.params.mode;
        var filterObj = {};

        if (!isNaN(EmplID)) {
            switch (mode) {

                case 'consulting':
                    filterObj = {

                        ConsultingEmplID: EmplID

                    }
                    break;

                case 'consulted':
                    filterObj = {

                        ConsultedEmplID: EmplID

                    }
                    break;

            }
        }

        consultancy.find(filterObj,function (err, docs) {

            if (err) {
                console.log(err);
                res.json({ Result: 'ERROR', Message: err });
            } else {

                common.filterList(docs, req, res);

            }


        })


    },

    add: function (req, res) {

        var newconsultancy = new consultancy(req.body);

        newconsultancy.save(function (err, doc) {

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

        consultancy.update(req.body.EmplID, getRidOfKey(req.body), function (err, doc) {

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

        consultancy.remove(req.body, function (err) {

            if (err)
                console.log(err);

            res.json({

                Result: err ? 'ERROR' : 'OK',
                Message: 'Database Error'


            })


        })


    }

}