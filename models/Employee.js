var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var EmployeeSchema = new Schema({

    EmplID: {

        type: Number,
        unique: true

    },
    EmplRcd: Number,
    Name: String,
    ChildDepartment: String,
    OfficerCode: String,
    JobTitle: String,
    Mail: String

}, { collection: 'employee' });

module.exports = mongoose.model('Employee', EmployeeSchema);