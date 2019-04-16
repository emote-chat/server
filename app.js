const PORT = process.env.PORT || 5710;
const NODE_ENV = process.env.NODE_ENV || 'development'; // 'production' if production
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

const signupRoute = require(path.join(__dirname, "routes/signup"));
const loginRoute = require(path.join(__dirname, "routes/login"));
const usersRoute = require(path.join(__dirname, "routes/users")); 
const chatsRoute = require(path.join(__dirname, "routes/chats"));
const messagesRoute = require(path.join(__dirname, "routes/messages"));

app.set('port', PORT);
app.set('mode', NODE_ENV);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/signup', signupRoute);
app.use('/login', loginRoute);
app.use('/user', usersRoute);
app.use('/chat', chatsRoute);
app.use('/message', messagesRoute);

// we don't really need this endpoint
// just added reassurance that server is up and running if you want it
app.get('/', (req, res) => {
	res.send("Good to go");
});

app.use((req,res) => {
	res.status(404).send("What you're trying to access doesn't exist");
});

app.use((err, req, res, next) => {
	res.status(500).send(err.stack);
});

app.listen(app.get('port'), () => {
	const isModeProduction = app.get('mode') === 'production';
	process.stdout.write(`Express started on ${isModeProduction ? 'http://emote.ml' : 'http://localhost'}:${app.get('port')}`);
	process.stdout.write(`; ${isModeProduction ? '' : 'press Ctrl-C to terminate'}\n`);
});
