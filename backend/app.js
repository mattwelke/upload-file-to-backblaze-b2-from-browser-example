var express = require('express');
var path = require('path');
var logger = require('morgan');

var getUploadDetailsHandler = require('./routes/getUploadDetails');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/getUploadDetails', getUploadDetailsHandler);

module.exports = app;
