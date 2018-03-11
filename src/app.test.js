import { expect } from 'chai';
import supertest from 'supertest';

// Module.
import app from './app';

describe('app', () => {
    const route = '/zfg';
    const scope = {
        body: null
    };
    const token = 'some excessively long string';

    beforeEach(() => {
        process.env.SLACK_TOKEN = token;

        scope.body = {
            token,
            team_id: 'T0001',
            team_domain: 'example',
            channel_id: 'C2147483705',
            channel_name: 'test',
            user_id: 'U2147483697',
            user_name: 'Peter Perfect',
            command: '/wfh',
            text: '94070',
            response_url: 'https://hooks.slack.com/commands/1234/5678'
        };
    });

    afterEach(() => {
        delete process.env.SLACK_TOKEN;

        scope.body = null;
    });

    describe('/zfg', () => {
        it('should return a 401 if the token is not defined', () => {
            delete scope.body.token;

            return supertest(app)
                .post(route)
                .send(scope.body)
                .expect(401);
        });

        it('should return a 401 if the token is invalid', () => {
            delete process.env.SLACK_TOKEN;

            scope.body.token = 'i am not a valid token';

            return supertest(app)
                .post(route)
                .send(scope.body)
                .expect(401);
        });

        it('should return a successful response', () => {
            return supertest(app)
                .post(route)
                .send(scope.body)
                .expect(200)
                .expect('Content-Type', /json/)
                .then(response => {
                    expect(response.body).to.have.property('response_type');
                    expect(response.body.response_type).to.equal('in_channel');

                    expect(response.body).to.have.property('text');
                });
        });
    });
});
