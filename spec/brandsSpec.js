const request = require('supertest');

describe('Brands', () => {
	let app;
	beforeEach(() => {
		app = require('../app.js');
	});
	afterEach(() => {
		app.close();
	});

	it('gets all brands', done => {
		request(app)
			.get('/brands')
			.expect(200)
			.end((err, res) => {
				if (err) return done.fail(err);
				expect(res.body.length).toBeGreaterThan(0);
				done(res);
			});
	});

	it('gets a single brand', done => {
		request(app)
			.get('/brands/44763ebb-032c-4ba7-b3b4-2e2cc1b2fff3')
			.expect(200)
			.end((err, res) => {
				if (err) return done.fail(err);
				expect(res.body).not.toBeNull();
				done(res);
			});
	});

	it('creates a new brand', done => {
		request(app)
			.post('/brands')
			.send({
				name: 'Test Brand',
				email: null,
				phone_number: null,
				city: null,
				state: null
			})
			.expect(200)
			.end((err, res) => {
				if (err) return done.fail(err);
				expect(res.body.name).toEqual('Test Brand');
				done(res);
			});
	});

	it('finds an existing brand', done => {
		request(app)
			.get('/brands/search?q=The Pattern Makers')
			.expect(200)
			.end((err, res) => {
				if (err) return done.fail(err);
				expect(res.body).not.toBeNull();
				done(res);
			});
	});

	it('returns 404 when it can\'t find a brand', done => {
		request(app)
			.get('/brands/search?q=foo bar')
			.expect(404)
			.end((err, res) => {
				if (err) return done.fail(err);
				done(res);
			});
	});
});