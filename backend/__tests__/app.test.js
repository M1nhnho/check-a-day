const request = require('supertest');
const app = require('../app.js');
const db = require('../database/connection.js');
const seed = require('../database/seeds/seed.js');
const data = require('../database/data/test-data');
const endpointsData = require('../endpoints.json');

beforeEach(() => seed(data));
afterAll(() => db.end());

describe('/api', () =>
{
    describe('GET', () =>
    {
        test("STATUS 200 - Responds with a JSON object describing all the available endpoints.", () =>
        {
            return request(app)
                .get('/api')
                .expect(200)
                .then(({ body: { endpoints } }) =>
                {
                    expect(endpoints).toEqual(endpointsData);
                });
        });
    });
    describe('/healthCheck', () =>
    {
        describe('GET', () =>
        {
            test("STATUS 200 - Responds that the server is live.", () =>
            {
                return request(app)
                    .get('/api/healthCheck')
                    .expect(200)
                    .then(({ body: { msg } }) =>
                    {
                        expect(msg).toBeString(); // As long as a message returns, server is live (no need to test for exact message)
                    });
            });
        });
    });

    describe('/users', () =>
    {
        describe('POST', () =>
        {
            test("STATUS 201 - Responds with the new user object without the optional avatar.", () =>
            {
                return request(app)
                    .post('/api/users')
                    .send(
                        {
                            username: 'test',
                            email: 'test@email.co.uk',
                            password: 'test-password'
                        }
                    )
                    .expect(201)
                    .then(({ body: { user } }) =>
                    {
                        expect(user).toMatchObject(
                            {
                                user_id: 4,
                                username: 'test',
                                avatar_url: null
                            }
                        );
                    });
            });
            test("STATUS 201 - Responds with the new user object with sent avatar URL.", () =>
            {
                return request(app)
                    .post('/api/users')
                    .send(
                        {
                            username: 'test',
                            email: 'test@email.co.uk',
                            password: 'test-password',
                            avatar_url: 'test-avatar-url'
                        }
                    )
                    .expect(201)
                    .then(({ body: { user } }) =>
                    {
                        expect(user).toMatchObject(
                            {
                                user_id: 4,
                                username: 'test',
                                avatar_url: 'test-avatar-url'
                            }
                        );
                    });
            });
            test("STATUS 400 - Responds with 'Bad Request' when sent object is missing required properties.", () =>
            {
                return request(app)
                    .post('/api/users')
                    .send(
                        {
                            username: 'test'
                        }
                    )
                    .expect(400)
                    .then(({ body: { msg } }) =>
                    {
                        expect(msg).toBe('Bad Request');
                    });
            });
        });
    });
});
