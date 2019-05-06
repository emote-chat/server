const path = require('path');
const request = require('supertest');
const app = require(path.join(__dirname, '../src/config/app'));
const { user, anotherUser, invalidUser } = require(path.join(__dirname, 'helpers/db'));
const { initSchema } = require(path.join(__dirname, '../src/db/migrations/seed'));

describe('Test Suite for user', () => {

    let server = null;
    let db = null;
    // use the same access token across tests in this suite 
    let accessToken = null;

    beforeAll(async (done) => {
        server = await app.listen();
        db = require(path.join(__dirname, '../src/db/index'));
        await initSchema(db);

        // sign up user to retrieve valid access token
        const { text } = await request(server)
            .post('/api/signup')
            .send(user);

        // sign up another user
        await request(server)
            .post('/api/signup')
            .send(anotherUser);

        // use the access token for subsequent requests
        accessToken = JSON.parse(text).access_token;

        done();
    });

    afterAll(async (done) => {
        await db.$pool.end();
        await server.close(done);
        done();
    });

    // GET /api/user/:email; get user id by email
    test('GET /api/user/:email should respond with 401 if user NOT authenticated', async (done) => {
        const { statusCode } = await request(server)
            .get(`/api/user/${anotherUser.email}`);

        expect(statusCode).toBe(401);

        done();
    });

    // GET /api/user/:email; get user id by email
    test('GET /api/user/:email should respond with 404 if user NOT found', async (done) => {
        const { statusCode } = await request(server)
            .get(`/api/user/${invalidUser.email}`)
            .set('Authorization', 'Bearer ' + accessToken);;

        expect(statusCode).toBe(404);

        done();
    });

    test('GET /api/user/:email should respond with 200 if user authenticated AND user exists', async (done) => {
        const { statusCode, text } = await request(server)
            .get(`/api/user/${anotherUser.email}`)
            .set('Authorization', 'Bearer ' + accessToken);

        expect(statusCode).toBe(200);

        // verify response data is correct
        expect(JSON.parse(text)).toEqual({
            id: expect.any(Number)
        });

        done();
    });
});