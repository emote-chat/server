const path = require('path');
const request = require('supertest');
const app = require(path.join(__dirname, '../src/config/app'));
const { user, anotherUser, chatData, messageData, reactionData } = require(path.join(__dirname, 'helpers/db'));
const { initSchema } = require(path.join(__dirname, '../src/db/migrations/seed'));

describe('Test Suite for message', () => {

    let server = null;
    let db = null;
    // use the same data across tests in this suite 
    let accessToken = null;
    let otherUserAccessToken = null;
    let userId = null;
    let otherUserId = null;
    let chat = null;
    let message = null;

    beforeAll(async (done) => {
        server = await app.listen();
        db = require(path.join(__dirname, '../src/db/index'));
        await initSchema(db);
        
        // sign up user to retrieve valid access token
        const { text } = await request(server)
            .post('/api/signup')
            .send(user);
        
        // sign up another user
        const { text: otherUserText } = await request(server)
            .post('/api/signup')
            .send(anotherUser);
        
        // use the access token and user data for subsequent requests
        accessToken = JSON.parse(text).access_token;
        userId = JSON.parse(text).user.id;

        // use the other user's access token and user data for subsequent requests
        otherUserAccessToken = JSON.parse(otherUserText).access_token;
        otherUserId = JSON.parse(otherUserText).user.id;

        // create a chat
        const { text: chatText } = await request(server)
            .post('/api/chat')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('userId', userId)
            .send(chatData);

        chat = JSON.parse(chatText);

        // add other user to chat
        await request(server)
            .post(`/api/chat/${chat.id}/${otherUserId}`)
            .set('Authorization', `Bearer ${otherUserAccessToken}`);

        // create a message in that chat
        const { text: messageText } = await request(server)
            .post(`/api/chat/${chat.id}/message`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('userId', userId)
            .send(messageData);

        message = JSON.parse(messageText);

        done();
    });

    afterAll(async (done) => {
        await db.$pool.end();
        await server.close(done);
        done();
    });

    // POST /api/message/1/add-reaction; add reaction to message
    test('POST /api/message/:mid/add-reaction should respond with 401 if user NOT authenticated', async (done) => {
        const { statusCode } = await request(server)
            .post('/api/message/1/add-reaction');

        // expect not authorized error since token not set/sent in headers
        expect(statusCode).toBe(401);

        done();
    });

    test('POST /api/message/:mid/add-reaction should respond with 400 if missing data', async (done) => {
        const { statusCode } = await request(server)
            .post('/api/message/1/add-reaction')
            .set('Authorization', `Bearer ${accessToken}`);

        // expect bad request error since data/emoji missing
        expect(statusCode).toBe(400);

        done();
    });

    test('POST /api/message/:mid/add-reaction should respond with 404 if message does NOT exist', async (done) => {
        const { statusCode } = await request(server)
            .post('/api/message/2/add-reaction')
            .set('Authorization', `Bearer ${accessToken}`);

        // expect not found since message id invalid (message does not exist)
        expect(statusCode).toBe(404);

        done();
    });

    test('POST /api/message/:mid/add-reaction with proper data should respond with 201', async (done) => {
        const { statusCode, text } = await request(server)
            .post(`/api/message/${message.id}/add-reaction`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('userId', otherUserId)
            .send(reactionData);
        // expect success since text provided
        expect(statusCode).toBe(201);

        /* expect format:
            {
                messages_id: 1,
                users_id: 2,
                emoji: '😄',
            }
        */
        expect(JSON.parse(text)).toEqual(reactionData);

        done();
    });
});