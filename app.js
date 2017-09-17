var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var index = require('./routes/index');
var account = require('./routes/account');
var employee = require('./routes/employee');
var customer = require('./routes/customer');
var consultancy = require('./routes/consultancy');


mongoose.connect(`mongodb://localhost/document_manager`);
//mongoose.connect('mongodb://buiduykhoi:buiduykhoi@ds149763.mlab.com:49763/document_manager');

var app = express();

// view setup
app.use(express.static(path.join(__dirname, 'views')));
// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public','images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/assets', express.static(path.join(__dirname, 'public')));
app.use('/lib', express.static(path.join(__dirname, 'bower_components')));
app.use('/data', express.static(path.join(__dirname, 'data')));

app.use('/', index);
app.use('/account', account);
app.use('/employee', employee);
app.use('/customer',customer);
app.use('/consultancy',consultancy);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;