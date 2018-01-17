const request = require('supertest');
const companyStore = require('json-fs-store')('store/companies');
const deleteBrand = {
	id: 1,
	name: 'Test Brand',
	email: null,
	phone_number: null,
	city: null,
	state: null,
	company_type: 'brand'
};

describe('Brands', () => {

	let app;
	const data = [];

	beforeAll(() => {
		app = require('../app.js');
		// add deleteBrand (defined at top of file), to later on delete, through test
		companyStore.add(deleteBrand, err => { if (err) throw err; });
		// put together list of brands prior to running tests
		companyStore.list((err, brands) => { brands.forEach((brand) => { brand.company_type === "brand" ? data.push(brand) : null; }); });
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

	it('should include name, email, phone_number, city, state, company_type', done => {
		request(app)
			.get('/brands/0a75d3f4-c8ff-47bb-84c3-a874007d1b4f')
			.expect(200)
			.end((err, res) => {
				if (err) return done.fail(err);
				const actual = Object.keys(res.body);
				const expected = [
					'name',
					'email',
					'phone_number',
					'city',
					'state',
					'company_type'
				];
				expect(actual).toEqual(expected);
				done(res);
			});
	});

	it('gets a single brand', done => {
		request(app)
			.get('/brands/ca357abb-573e-4a29-a731-b61bd40f6332')
			.expect(200)
			.end((err, res) => {
				if (err) return done.fail(err);
				expect(res.body).not.toBeNull();
				done(res);
			});
	});

	it('deletes a brand', done => {
		request(app)
			.delete(`/brands/1/delete`) // deletes brand that was added before test was ran
			.expect(200)
			.end((err, res) => {
				if (err) return done.fail(err);
				expect(res.body.length).toBeLessThan(data.length);
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