const request = require('supertest');
const companyStore = require('json-fs-store')('store/companies');
const deleteFactory = {
    id: 2,
    name: 'Test Factory',
    email: null,
    phone_number: null,
    city: null,
    state: null,
    company_type: 'factory'
};

describe('Factories', () => {

    let app;
    const data = [];

    beforeAll(() => {
        app = require('../app.js');
        // add deleteFactory (defined at top of file), to later on delete, through test
        companyStore.add(deleteFactory, err => { if (err) throw err });
        // put together list of factories prior to running tests
        companyStore.list((err, factories) => { factories.forEach((factory) => { factory.company_type === "factory" ? data.push(factory) : null; }); });
    });

    afterEach(() => {
        app.close();
    });

    it('gets all factories', done => {
        request(app)
            .get('/factories')
            .expect(200)
            .end((err, res) => {
                if (err) return done.fail(err);
                expect(res.body.length).toBeGreaterThan(0);
                done(res);
            });
    });

    it('should include name, email, phone_number, city, state, company_type', done => {
        request(app)
            .get('/factories/4fb77a81-4fec-4bb8-bc10-91c0ee5fe674')
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

    it('gets a single factory', done => {
        request(app)
            .get('/factories/4fb77a81-4fec-4bb8-bc10-91c0ee5fe674') // admittedly, this is an ugly id.
            .expect(200)
            .end((err, res) => {
                if (err) return done.fail(err);
                expect(res.body).not.toBeNull();
                done(res);
            });
    });

    it('deletes a factory', done => {
        request(app)
            .delete(`/factories/2/delete`) // deletes factory that was added before test was ran
            .expect(200)
            .end((err, res) => {
                if (err) return done.fail(err);
                expect(res.body.length).toBeLessThan(data.length);
                done(res);
            });
    });

    it('creates a new factory', done => {
        request(app)
            .post('/factories')
            .send({
                name: 'Test Factory',
                email: null,
                phone_number: null,
                city: null,
                state: null
            })
            .expect(200)
            .end((err, res) => {
                if (err) return done.fail(err);
                expect(res.body.name).toEqual('Test Factory');
                done(res);
            });
    });

    it('finds an existing factory', done => {
        request(app)
            .get('/factories/search?q=Test Factory')
            .expect(200)
            .end((err, res) => {
                if (err) return done.fail(err);
                expect(res.body).not.toBeNull();
                done(res);
            });
    });

    it('returns 404 when it can\'t find a factory', done => {
        request(app)
            .get('/factories/search?q=foo bar')
            .expect(404)
            .end((err, res) => {
                if (err) return done.fail(err);
                done(res);
            });
    });
});