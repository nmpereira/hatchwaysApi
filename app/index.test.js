const supertest = require('supertest');
const app = require('./index');

describe('GET /', () => {
	it('responds with json for /', (done) => {
		supertest(app).get('/').set('Accept', 'application/json').expect('Content-Type', /json/).expect(200, done);
	});
});
