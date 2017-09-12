module.exports = {

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

    }


}