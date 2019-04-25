// load environment vars from .env file
require('dotenv').config(); 

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const jwt = require('express-jwt');

// bring in route defs
const signupRouter = require(path.join(__dirname, 'routes/signup'));
const loginRouter = require(path.join(__dirname, 'routes/login'));
const usersRouter = require(path.join(__dirname, 'routes/users')); 
const chatsRouter = require(path.join(__dirname, 'routes/chats'));
const messagesRouter = require(path.join(__dirname, 'routes/messages'));

// global error handler
const errorHandler = require(path.join(__dirname, 'helpers/errorHandler'));

// set app port and mode; default to dev't and 5710 respectively
app.set('port', process.env.PORT || 5710);
app.set('mode', process.env.NODE_ENV || 'development');

// make sure we can properly parse the req.body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// serve API documentation generated via apidoc at /
app.use(express.static(path.join(__dirname, "public")));

// middleware for verifying token for protected routes
const unprotectedRoutes = ['/login', '/signup', '/'];
app.use(jwt({
    secret: process.env.SECRET,
    credentialsRequired: true
}).unless({ path: unprotectedRoutes }));

// set app to use the given paths for the given route defs
app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/user', usersRouter);
app.use('/chat', chatsRouter);
app.use('/message', messagesRouter);

// global error handler
app.use(errorHandler);

// export app to be included for tests and running of server
module.exports = app;