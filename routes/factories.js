const express = require('express');
const companyStore = require('json-fs-store')('store/companies');
const router = express.Router();

router.get('/', (req, res) => {
    let resultfactories = []
    companyStore.list((err, factories) => {
        factories.forEach((factory) => {
            if (factory.company_type === "factory") {
                factory.push(factory)
            }
        })
    });
    res.json(resultfactories);
});

router.get('/search', (req, res) => {
    const searchQuery = req.query.q;
    companyStore.list((err, factories) => {
        factories.forEach((factory, idx) => {
            if (factory.name === searchQuery) {
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

    const newFactory = { name: req.body.name };
    companyStore.add(newFactory, err => {
        if (err) throw err;
        res.json(newFactory);
    });
});

module.exports = router;
