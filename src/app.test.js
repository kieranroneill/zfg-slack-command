import axios from 'axios';
import { expect } from 'chai';
import { stub } from 'sinon';
import supertest from 'supertest';

// Module.
import app from './app';

describe('app', () => {
    const route = '/zfg';
    const scope = {
        axiosGetStub: null,
        body: null
    };
    const token = 'cff5TL3XLwboeZD5aPhyvEdB';

    beforeEach(() => {
        scope.axiosGetStub = stub(axios, 'get');
        scope.body = {
            token,
            team_id: 'T0001',
            team_domain: 'example',
            channel_id: 'C2147483705',
            channel_name: 'test',
            user_id: 'U2147483697',
            user_name: 'Peter Perfect',
            command: '/zfg',
            text: '94070',
            response_url: 'https://hooks.slack.com/commands/1234/5678'
        };
    });

    afterEach(() => {
        scope.body = null;

        scope.axiosGetStub.restore();
    });

    describe('/zfg', () => {
        it('should return a 403 if the token is not defined', () => {
            delete scope.body.token;

            return supertest(app)
                .post(route)
                .send(scope.body)
                .expect(403);
        });

        it('should return a 403 if the token is invalid', () => {
            scope.body.token = 'i am not a valid token';

            return supertest(app)
                .post(route)
                .send(scope.body)
                .expect(403);
        });

        it('should return a 400 if the giphy request is a malformed request', () => {
            scope.axiosGetStub.rejects({ response: { status: 400 } });

            return supertest(app)
                .post(route)
                .send(scope.body)
                .expect(400);
        });

        it('should return a 400 if the giphy request has too many requests', () => {
            scope.axiosGetStub.rejects({ response: { status: 403 } });

            return supertest(app)
                .post(route)
                .send(scope.body)
                .expect(400);
        });

        it('should return a 400 if the giphy request is unauthorised', () => {
            scope.axiosGetStub.rejects({ response: { status: 429 } });

            return supertest(app)
                .post(route)
                .send(scope.body)
                .expect(400);
        });

        it('should return a successful response', () => {
            const imageUrl = 'http://some.funny.gif';
            const expectedResponse = {
                response_type: 'in_channel',
                attachments: [{ title: 'Zero fucks given', image_url: imageUrl }]
            };

            scope.axiosGetStub.resolves({
                data: {
                    data: [{ images: { fixed_width: { url: imageUrl } } }]
                }
            });

            return supertest(app)
                .post(route)
                .send(scope.body)
                .expect(200)
                .expect('Content-Type', /json/)
                .then(response => expect(response.body).to.deep.equal(expectedResponse));
        });
    });
});
