const path = require('path');

// bring in all of the route defs
const signupRouter = require(path.join(__dirname, 'signup'));
const loginRouter = require(path.join(__dirname, 'login'));
const usersRouter = require(path.join(__dirname, 'users')); 
const chatsRouter = require(path.join(__dirname, 'chats'));
const messagesRouter = require(path.join(__dirname, 'messages'));

const express = require('express');
const router = express.Router();

// set router to use the given paths for the given route defs
router.use('/signup', signupRouter);
router.use('/login', loginRouter);
router.use('/user', usersRouter);
router.use('/chat', chatsRouter);
router.use('/message', messagesRouter);

module.exports = router;