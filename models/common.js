module.exports = {

    removeKey: function (obj) {

        delete obj[Object.keys(obj)[0]];
        return obj;

    },

    filterList: function (docs, req, res) {

        var retList = [];
        if (req.body.startDate) {

            var newStartDate = new Date(req.body.startDate);
            var newEndDate = new Date(req.body.endDate);
            newStartDate.setHours(0, 0, 0, 0);
            newEndDate.setHours(0, 0, 0, 0);
            console.log(newStartDate);
            console.log(newEndDate);
            console.log('----');
            for (var i = 0; i < docs.length; i++) {
                var date = new Date(docs[i].Time);
                date.setDate(date.getDate() + 1);
                date.setHours(0, 0, 0, 0);
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

        });

    },

    forOptions: function (err, docs, key, display, res) {

        if (err) {
            console.log(err);
            res.json({

                Result: 'ERROR',
                Message: 'Database error'

            })
        }
        else {

            var displayed = display.split(' ');
            var options = [];
            for (var i = 0; i < docs.length; i++)
                options.push({

                    Value: docs[i][key],
                    DisplayText: `${docs[i][displayed[0]]} - ${docs[i][displayed[1]]}`

                });
            res.json({

                Result: 'OK',
                Options: options

            });

        }


    },

    forList: function (err, docs, req, res) {

        if (err) {
            console.log(err);
            res.json({

                Result: 'ERROR',
                Message: 'Database error'

            })
        }
        else
            res.json({

                Result: 'OK',
                TotalRecordCount: docs.length,
                Records: docs.slice(req.query.jtStartIndex,req.query.jtStartIndex + req.query.jtPageSize)

            });

    },

    forDetails: function (err, doc, res) {

        if (err) {
            console.log(err);
            res.json({

                Result: 'ERROR',
                Message: 'Database error'

            })
        }
        else
            res.json({

                Result: 'OK',
                Record: doc

            });


    },

    forDelete: function (err, doc, res) {

        if (err) {
            console.log(err);
            res.json({

                Result: 'ERROR',
                Message: 'Database error'

            })
        }
        else
            res.json({

                Result: 'OK'

            });


    }


}