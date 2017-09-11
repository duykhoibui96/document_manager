var consultancy = require('../models/Consultancy');

var getRidOfKey = function (object) {

    delete object.ConsID;
    return object;

}

module.exports = {

    list: function (req, res) {

        var dateRange = req.query.dateRange;
        consultancy.find(function (err, docs) {

            if (err) {
                console.log(err);
                res.json({ Result: 'ERROR', Message: err });
            } else {

                var retList = [];
                if (dateRange !== 'undefined') {

                    var dateRangeList = dateRange.split(',');
                    console.log(dateRangeList);
                    var newStartDate = new Date(dateRangeList[0]);
                    var newEndDate = new Date(dateRangeList[1]);
                    newStartDate.setHours(0,0,0,0);
                    newEndDate.setHours(0,0,0,0);
                    console.log(newStartDate);
                    console.log(newEndDate);
                    console.log('----');
                    for (var i = 0; i < docs.length; i++) {
                        var date = new Date(docs[i].Time);
                        date.setDate(date.getDate() + 1);
                        date.setHours(0,0,0,0);
                        console.log(date);
                        if (date >= newStartDate && date <= newEndDate)
                            retList.push(docs[i]);
                    }

                }
                else
                     retList = docs;


                res.json({

                    Result: 'OK',
                    TotalRecordCount: retList.length,
                    Records: retList.slice(req.query.jtStartIndex).slice(0, req.query.jtPageSize)

                })
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