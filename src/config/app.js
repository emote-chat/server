// load environment vars from .env file
require('dotenv').config(); 

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const jwt = require('express-jwt');
const morgan = require('morgan');

// bring in route defs
const router = require(path.join(__dirname, '../routes/index'));

// global error handler
const errorHandler = require(path.join(__dirname, '../helpers/error'));

// set app port and mode; default to dev't and 5710 respectively
app.set('port', process.env.PORT || 5710);
app.set('mode', process.env.NODE_ENV || 'development');

// make sure we can properly parse the req.body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// serve API documentation generated via apidoc at /
app.use(express.static(path.join(__dirname, '../../public')));

// use morgan for logging API requests
if (app.get('mode') === 'production') {
    app.use(morgan('common', {
        skip: function (req, res) {
            return res.statusCode < 400 && req.url.includes('api')
        },
        stream: require('fs').createWriteStream(
            path.join(__dirname, '../../morgan.log'), 
            { 
                flags: 'a' 
            }
        )
    }));
} else if (app.get('mode') === 'development') {
    app.use(morgan('dev'));
}

// middleware for verifying token for protected routes
const unprotectedRoutes = ['/api/login', '/api/signup', '/'];
app.use(jwt({
    secret: process.env.SECRET,
    credentialsRequired: true
}).unless({ path: unprotectedRoutes }));

// set app to use the given prefix for the routes
app.use('/api', router);

// global error handler
app.use(errorHandler);

// export app to be included for tests and running of server
module.exports = app;