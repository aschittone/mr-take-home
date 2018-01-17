const express = require('express');
const companyStore = require('json-fs-store')('store/companies');
const router = express.Router();

router.get('/', (req, res) => {
    let resultFactories = []
    companyStore.list((err, factories) => {
        factories.forEach((factory) => {
            if (factory.company_type === "factory") {
                resultFactories.push(factory)
            }
        })
        res.json(resultFactories);
    });
});

router.get('/search', (req, res) => {
    const searchQuery = req.query.q;
    companyStore.list((err, factories) => {
        factories.forEach((factory, idx) => {
            if (factory.name === searchQuery && factory.company_type === "factory") {
                res.json(factory);
            } else if (idx === factories.length - 1 || searchQuery === undefined) {
                res.sendStatus(404)
            }
        });
    });
});

router.get('/:id', (req, res) => {
    companyStore.load(req.params.id, (err, factory) => {
        if (err) throw err;
        res.json(factory);
    });
});

router.post('/', (req, res) => {
    if (!req.body) return res.sendStatus(400);
    const newFactory = {
        name: req.body.name,
        email: req.body.email,
        phone_number: req.body.phone_number,
        city: req.body.city,
        state: req.body.state,
        company_type: 'factory'
    };
    companyStore.add(newFactory, err => {
        if (err) throw err;
        res.json(newFactory);
    });
});

module.exports = router;
