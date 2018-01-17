const request = require('supertest');

describe('Factories', () => {
    let app;
    beforeEach(() => {
        app = require('../app.js');
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

    it('gets a single factory', done => {
        request(app)
            .get('/factories/fae517bd-5dd7-4440-8e69-65f1b937fb2a') // admittedly, this is an ugly id.
            .expect(200)
            .end((err, res) => {
                if (err) return done.fail(err);
                expect(res.body).not.toBeNull();
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