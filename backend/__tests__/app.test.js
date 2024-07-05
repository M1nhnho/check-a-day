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

        describe('/login/authentication', () =>
        {
            describe('POST', () =>
            {
                test("STATUS 200 - Responds with authentication as true upon successful login.", () =>
                {
                    return request(app)
                        .post('/api/users/login/authentication')
                        .send(
                            {
                                email: 'admin@email.co.uk',
                                password: 'admin-password'
                            }
                        )
                        .expect(200)
                        .then(({ body: { authenticated } }) =>
                        {
                            expect(authenticated).toBe(true);
                        });
                });
                test("STATUS 401 - Responds with authentication as false if sent email or password is faulty.", () =>
                {
                    return request(app)
                        .post('/api/users/login/authentication')
                        .send(
                            {
                                email: 'admin@email.co.uk',
                                password: 'not-admin-password'
                            }
                        )
                        .expect(401)
                        .then(({ body: { msg } }) =>
                        {
                            expect(msg).toBe('Unauthorised');
                        });
                });
            });
        });

        describe('/:user_id', () =>
        {
            describe('GET', () =>
            {
                test("STATUS 200 - Responds with the user object of the requested user ID.", () =>
                {
                    return request(app)
                        .get('/api/users/1')
                        .expect(200)
                        .then(({ body: { user } }) =>
                        {
                            expect(user).toMatchObject(
                                {
                                    user_id: 1,
                                    username: 'admin',
                                    avatar_url: null
                                }
                            );
                        });
                });
                test("STATUS 404 - Responds with 'Not Found' when requested with a valid but non-existent user ID.", () =>
                {
                    return request(app)
                        .get('/api/users/999999')
                        .expect(404)
                        .then(({ body: { msg } }) =>
                        {
                            expect(msg).toBe('Not Found');
                        });
                });
                test("STATUS 400 - Responds with 'Bad Request' when requested with an invalid user ID.", () =>
                {
                    return request(app)
                        .get('/api/users/not-a-number')
                        .expect(400)
                        .then(({ body: { msg } }) =>
                        {
                            expect(msg).toBe('Bad Request');
                        });
                });
            });

            describe('PATCH', () =>
            {
                test("STATUS 200 - Responds with the updated user object of the requested user ID with one new sent value.", () =>
                {
                    return request(app)
                        .patch('/api/users/1')
                        .send(
                            {
                                username: 'updated-test-username'
                            }
                        )
                        .expect(200)
                        .then(({ body: { user } }) =>
                        {
                            expect(user).toMatchObject(
                                {
                                    user_id: 1,
                                    username: 'updated-test-username',
                                    avatar_url: null
                                }
                            );
                        });
                });
                test("STATUS 200 - Responds with the updated user object of the requested user ID with multiple new sent values.", () =>
                {
                    return request(app)
                        .patch('/api/users/1')
                        .send(
                            {
                                username: 'updated-test-username',
                                avatar_url: 'updated-test-avatar'
                            }
                        )
                        .expect(200)
                        .then(({ body: { user } }) =>
                        {
                            expect(user).toMatchObject(
                                {
                                    user_id: 1,
                                    username: 'updated-test-username',
                                    avatar_url: 'updated-test-avatar'
                                }
                            );
                        });
                });
                test("STATUS 404 - Responds with 'Not Found' when requested with a valid but non-existent user ID.", () =>
                {
                    return request(app)
                        .patch('/api/users/999999')
                        .send(
                            {
                                username: 'updated-test-username'
                            }
                        )
                        .expect(404)
                        .then(({ body: { msg } }) =>
                        {
                            expect(msg).toBe('Not Found');
                        });
                });
                test("STATUS 400 - Responds with 'Bad Request' when requested with an invalid user ID.", () =>
                {
                    return request(app)
                        .patch('/api/users/not-a-number')
                        .send(
                            {
                                username: 'updated-test-username'
                            }
                        )
                        .expect(400)
                        .then(({ body: { msg } }) =>
                        {
                            expect(msg).toBe('Bad Request');
                        });
                });
            });

            describe('DELETE', () =>
            {
                test("STATUS 204 - Responds with only status code 204.", () =>
                {
                    return request(app)
                        .delete('/api/users/1')
                        .expect(204)
                });
                test("STATUS 404 - Responds with 'Not Found' when requested with a valid but non-existent user ID.", () =>
                {
                    return request(app)
                        .delete('/api/users/999999')
                        .expect(404)
                        .then(({ body: { msg } }) =>
                        {
                            expect(msg).toBe('Not Found');
                        });
                });
                test("STATUS 400 - Responds with 'Bad Request' when requested with an invalid user ID.", () =>
                {
                    return request(app)
                        .delete('/api/users/not-a-number')
                        .expect(400)
                        .then(({ body: { msg } }) =>
                        {
                            expect(msg).toBe('Bad Request');
                        });
                });
            });
        });
    });
});
