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
            test("STATUS 201 - Responds with new user object without avatar URL if not sent.", () =>
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
            test("STATUS 201 - Responds with new user object with avatar URL sent.", () =>
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
                test("STATUS 200 - Responds with authentication as true if email and password sent are both correct.", () =>
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
                test("STATUS 401 - Responds with authentication as false if email or password sent is incorrect.", () =>
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
                test("STATUS 400 - Responds with 'Bad Request' when sent object is missing required properties.", () =>
                {
                    return request(app)
                        .post('/api/users/login/authentication')
                        .send(
                            {
                                email: 'admin@email.co.uk',
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

        describe('/:user_id', () =>
        {
            describe('GET', () =>
            {
                test("STATUS 200 - Responds with user object of the requested user ID.", () =>
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
                test("STATUS 200 - Responds with updated user object of requested user ID with one new value sent.", () =>
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
                test("STATUS 200 - Responds with updated user object of requested user ID with multiple new values sent.", () =>
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


            describe('/tasks', () =>
            {
                describe('POST', () =>
                {
                    test("STATUS 201 - Responds with new task object without optional properties sent.", () =>
                    {
                        return request(app)
                            .post('/api/users/1/tasks')
                            .send(
                                {
                                    name: 'test'
                                }
                            )
                            .expect(201)
                            .then(({ body: { task } }) =>
                            {
                                const currentDate = new Date().toJSON().slice(0, 10);
                                expect(task).toMatchObject(
                                    {
                                        task_id: 6,
                                        user_id: 1,
                                        name: 'test',
                                        question: null,
                                        colour_hex: null,
                                        icon: null,
                                        reset_time: null
                                    }
                                );
                                expect(task.check_in_dates[currentDate]).toBe(false);
                            });
                    });
                    test("STATUS 201 - Responds with new task object with some optional properties sent.", () =>
                    {
                        return request(app)
                            .post('/api/users/1/tasks')
                            .send(
                                {
                                    name: 'test',
                                    question: 'test-question?',
                                    colour_hex: '000000'
                                }
                            )
                            .expect(201)
                            .then(({ body: { task } }) =>
                            {
                                const currentDate = new Date().toJSON().slice(0, 10);
                                expect(task).toMatchObject(
                                    {
                                        task_id: 6,
                                        user_id: 1,
                                        name: 'test',
                                        question: 'test-question?',
                                        colour_hex: '000000',
                                        icon: null,
                                        reset_time: null
                                    }
                                );
                                expect(task.check_in_dates[currentDate]).toBe(false);
                            });
                    });
                    test("STATUS 201 - Responds with new task object with all optional properties sent.", () =>
                    {
                        return request(app)
                            .post('/api/users/1/tasks')
                            .send(
                                {
                                    name: 'test',
                                    question: 'test-question?',
                                    colour_hex: '000000',
                                    icon: 'test-icon',
                                    reset_time: '00:00'
                                }
                            )
                            .expect(201)
                            .then(({ body: { task } }) =>
                            {
                                const currentDate = new Date().toJSON().slice(0, 10);
                                expect(task).toMatchObject(
                                    {
                                        task_id: 6,
                                        user_id: 1,
                                        name: 'test',
                                        question: 'test-question?',
                                        colour_hex: '000000',
                                        icon: 'test-icon',
                                        reset_time: '00:00:00+01'
                                    }
                                );
                                expect(task.check_in_dates[currentDate]).toBe(false);
                            });
                    });
                    test("STATUS 404 - Responds with 'Not Found' when requested with a valid but non-existent user ID.", () =>
                    {
                        return request(app)
                            .post('/api/users/999999/tasks')
                            .send(
                                {
                                    name: 'test'
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
                            .post('/api/users/not-a-number/tasks')
                            .send(
                                {
                                    name: 'test'
                                }
                            )
                            .expect(400)
                            .then(({ body: { msg } }) =>
                            {
                                expect(msg).toBe('Bad Request');
                            });
                    });
                    test("STATUS 400 - Responds with 'Bad Request' when sent object is missing required properties.", () =>
                    {
                        return request(app)
                            .post('/api/users/1/tasks')
                            .send({})
                            .expect(400)
                            .then(({ body: { msg } }) =>
                            {
                                expect(msg).toBe('Bad Request');
                            });
                    });
                    test("STATUS 400 - Responds with 'Bad Request' when sent 'colour_hex' is not 6 characters long.", () =>
                    {
                        return request(app)
                            .post('/api/users/1/tasks')
                            .send(
                                {
                                    name: 'test',
                                    colour_hex: 'too-long',
                                }
                            )
                            .expect(400)
                            .then(({ body: { msg } }) =>
                            {
                                expect(msg).toBe('Bad Request');
                            });
                    });
                    test("STATUS 400 - Responds with 'Bad Request' when sent 'colour_hex' is not hexadecimal.", () =>
                    {
                        return request(app)
                            .post('/api/users/1/tasks')
                            .send(
                                {
                                    name: 'test',
                                    colour_hex: 'notHex',
                                }
                            )
                            .expect(400)
                            .then(({ body: { msg } }) =>
                            {
                                expect(msg).toBe('Bad Request');
                            });
                    });
                    test("STATUS 400 - Responds with 'Bad Request' when sent 'reset_time' is not a time.", () =>
                    {
                        return request(app)
                            .post('/api/users/1/tasks')
                            .send(
                                {
                                    name: 'test',
                                    reset_time: 'not-a-time',
                                }
                            )
                            .expect(400)
                            .then(({ body: { msg } }) =>
                            {
                                expect(msg).toBe('Bad Request');
                            });
                    });
                });
                describe('GET', () =>
                {
                    test("STATUS 200 - Responds with array of all task objects from requested user ID.", () =>
                    {
                        return request(app)
                            .get('/api/users/2/tasks')
                            .expect(200)
                            .then(({ body: { tasks } }) =>
                            {
                                expect(tasks.length).toBeGreaterThan(0);
                                tasks.forEach(({ task_id, user_id, name, check_in_dates, question, colour_hex, icon, reset_time }) =>
                                    {
                                        expect(task_id).toBeNumber();
                                        expect(user_id).toBeNumber();
                                        expect(name).toBeString();
                                        expect(check_in_dates).toBeObject();
                                        expect(check_in_dates).not.toBeEmptyObject();
                                        if (question) { expect(question).toBeString(); }
                                        if (colour_hex) { expect(colour_hex).toBeString(); }
                                        if (icon) { expect(icon).toBeString(); }
                                        if (reset_time) { expect(reset_time).toBeString(); }
                                    }
                                )
                            });
                    });
                    test("STATUS 200 - Responds with empty array from requested user ID if user has no tasks.", () =>
                    {
                        return request(app)
                            .get('/api/users/1/tasks')
                            .expect(200)
                            .then(({ body: { tasks } }) =>
                            {
                                expect(tasks).toBeArray();
                                expect(tasks).toHaveLength(0);
                            });
                    });
                    test("STATUS 404 - Responds with 'Not Found' when requested with a valid but non-existent user ID.", () =>
                    {
                        return request(app)
                            .get('/api/users/999999/tasks')
                            .expect(404)
                            .then(({ body: { msg } }) =>
                            {
                                expect(msg).toBe('Not Found');
                            });
                    });
                    test("STATUS 400 - Responds with 'Bad Request' when requested with an invalid user ID.", () =>
                    {
                        return request(app)
                            .get('/api/users/not-a-number/tasks')
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
});
