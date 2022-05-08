const supertest = require('supertest');
const assert = require('assert');

const app = require('./index');

describe('GET /', () => {
	it('responds with json', (done) => {
		supertest(app).get('/').set('Accept', 'application/json').expect('Content-Type', /json/).expect(200, done);
	});
});
