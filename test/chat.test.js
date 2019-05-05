const path = require('path');
const request = require('supertest');
const app = require(path.join(__dirname, '../src/config/app'));
const { user, anotherUser } = require(path.join(__dirname, 'helpers/db'));
const { initSchema } = require(path.join(__dirname, '../src/db/migrations/seed'));

describe('Test Suite for chat', () => {

    let server = null;
    let db = null;
    // use the same access token across tests in this suite 
    let accessToken = null;
    let otherUserAccessToken = null;

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

        // use the access token for subsequent requests
        accessToken = JSON.parse(text).access_token;

        // use the other user's access token for subsequent requests
        // to verify membership middleware working
        otherUserAccessToken = JSON.parse(otherUserText).access_token;

        done();
    });

    afterAll(async (done) => {
        await db.$pool.end();
        await server.close(done);
        done();
    });

    // GET /api/chat; get chats user is in
    test('GET /api/chat should respond with 401 if user NOT authenticated', async (done) => {
        const { statusCode } = await request(server)
            .get('/api/chat');

        // expect success since authenticated
        expect(statusCode).toBe(401);

        done();
    });

    test('GET /api/chat should respond with 200 if user authenticated', async (done) => {
        const { statusCode, text } = await request(server)
            .get('/api/chat')
            .set('Authorization', 'Bearer ' + accessToken);

        // expect success since authenticated
        expect(statusCode).toBe(200);

        // expect resp to be an array
        expect(Array.isArray(JSON.parse(text)));

        done();
    });


    // POST /api/chat; create chat
    test('POST /api/chat should respond with 401 if user NOT authenticated', async (done) => {
        const { statusCode } = await request(server)
            .post('/api/chat');

        // expect not authorized error since token not set/sent in headers
        expect(statusCode).toBe(401);

        done();
    });

    test('POST /api/chat with no data should respond with 201', async (done) => {
        const { statusCode, text } = await request(server)
            .post('/api/chat')
            .set('Authorization', 'Bearer ' + accessToken);

        // expect not authorized error since token not set/sent in headers
        expect(statusCode).toBe(201);

        // expect id to be some number and name to be null since not specified in req
        expect(JSON.parse(text)).toEqual({
            id: expect.any(Number),
            name: null
        });

        done();
    });

    test('POST /api/chat with data should respond with 201', async (done) => {
        const chat = { name: 'besties' };
        const { statusCode, text } = await request(server)
            .post('/api/chat')
            .set('Authorization', 'Bearer ' + accessToken)
            .send(chat);

        // expect not authorized error since token not set/sent in headers
        expect(statusCode).toBe(201);

        // expect id to be some number and name to be null since not specified in req
        expect(JSON.parse(text)).toEqual({
            id: expect.any(Number),
            name: chat.name
        });

        done();
    });

    // GET /api/chat/:cid; get chat messages
    test('GET /api/chat/:cid should respond with 401 if NOT authenticated', async (done) => {
        const { statusCode } = await request(server)
            .get('/api/chat/1');

        // expect not authorized error since NOT authenticated 
        expect(statusCode).toBe(401);

        done();
    });

    test('GET /api/chat/:cid should respond with 401 if NOT member of chat', async (done) => {
        const { statusCode } = await request(server)
            .get('/api/chat/1')
            .set('Authorization', 'Bearer ' + otherUserAccessToken);

        // expect not authorized error since NOT member of chat 
        expect(statusCode).toBe(401);

        done();
    });

    test('GET /api/chat/:cid should respond with 200 if authenticated and member of chat', async (done) => {
        const { statusCode, text } = await request(server)
            .get('/api/chat/1')
            .set('Authorization', 'Bearer ' + accessToken);

        // expect success since authenticated and member of chat
        expect(statusCode).toBe(200);

        // expect resp to be an array
        expect(Array.isArray(JSON.parse(text)));

        done();
    });

    // POST /api/chat/1/message; create message in chat
    test('POST /api/chat/:cid/message with text should respond with 400 if missing data', async (done) => {
        const { statusCode } = await request(server)
            .post('/api/chat/1/message')
            .set('Authorization', 'Bearer ' + accessToken);

        // expect bad request error since data/text missing
        expect(statusCode).toBe(400);

        done();
    });

    test('POST /api/chat/:cid/message should respond with 401 if user NOT authenticated', async (done) => {
        const { statusCode } = await request(server)
            .post('/api/chat/1/message');

        // expect not authorized error since token not set/sent in headers
        expect(statusCode).toBe(401);

        done();
    });

    test('POST /api/chat/:cid/message should respond with 401 if user NOT member of chat', async (done) => {
        const { statusCode } = await request(server)
            .post('/api/chat/1/message')
            .set('Authorization', 'Bearer ' + otherUserAccessToken);

        // expect not authorized error since NOT member of chat 
        expect(statusCode).toBe(401);

        done();
    });

    test('POST /api/chat/:cid/message with text should respond with 201', async (done) => {
        const { statusCode } = await request(server)
            .post('/api/chat/1/message')
            .set('Authorization', 'Bearer ' + accessToken)
            .send({ text: 'hey' });

        // expect success since authenticated and name is optional param
        expect(statusCode).toBe(201);

        done();
    });

    // POST /api/chat/1/2; add user to chat
    test('POST /api/chat/:cid/:uid should respond with 401 if NOT member of chat', async (done) => {
        const { statusCode } = await request(server)
            .post('/api/chat/1/2')
            .set('Authorization', 'Bearer ' + otherUserAccessToken);

        // expect not authorized error since NOT member of chat 
        expect(statusCode).toBe(401);

        done();
    });
    
    test('POST /api/chat/:cid/:uid should respond with 401 if NOT authenticated', async (done) => {
        const { statusCode } = await request(server)
            .post('/api/chat/1/2');

        // expect not authorized error since NOT authenticated 
        expect(statusCode).toBe(401);

        done();
    });

    test('POST /api/chat/:cid/:uid should respond with 400 if adding user that is already a member', async (done) => {
        const { statusCode } = await request(server)
            .post('/api/chat/1/1')
            .set('Authorization', 'Bearer ' + accessToken);

        // expect bad request error since attempting to double-add user
        expect(statusCode).toBe(400);

        done();
    });

    test('POST /api/chat/:cid/:uid should respond with 201 if authenticated and member of chat', async (done) => {
        const { statusCode } = await request(server)
            .post('/api/chat/1/2')
            .set('Authorization', 'Bearer ' + accessToken);

        // expect success since authenticated 
        expect(statusCode).toBe(201);

        done();
    });

    // DELETE /api/chat/1/2; delete user from chat
    test('DELETE /api/chat/:cid/:uid should respond with 401 if user NOT authenticated', async (done) => {
        const { statusCode } = await request(server)
            .delete('/api/chat/1/2');

        // expect not authorized error since NOT authenticated 
        expect(statusCode).toBe(401);

        done();
    });

    test('DELETE /api/chat/:cid/:uid should respond with 204 if user authenticated and member of chat', async (done) => {
        const { statusCode } = await request(server)
            .delete('/api/chat/1/2')
            .set('Authorization', 'Bearer ' + accessToken);

        // expect success since authenticated 
        expect(statusCode).toBe(204);

        done();
    });

    test('DELETE /api/chat/:cid/:uid should respond with 401 if user NOT member of chat', async (done) => {
        const { statusCode } = await request(server)
            .delete('/api/chat/1/1')
            .set('Authorization', 'Bearer ' + otherUserAccessToken);

        // expect not authorized error since NOT member of chat 
        expect(statusCode).toBe(401);

        done();
    });
});