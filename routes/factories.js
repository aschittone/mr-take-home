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
    let resultFactory = []
    if (!searchQuery) return res.sendStatus(404);
    companyStore.list((err, factories) => {
        factories.forEach((factory, idx) => {
            if (factory.name === searchQuery && factory.company_type === "factory") {
                resultFactory.push(factory)
            }
        });
        resultFactory.length >= 1 ? res.json(resultFactory[0]) : res.sendStatus(404);
    });
})

router.get('/:id', (req, res) => {
    companyStore.load(req.params.id, (err, factory) => {
        if (err) throw err;
        res.json(factory);
    });
});

router.post('/', (req, res) => {
    if (!req.body.name) return res.sendStatus(400);
    debugger
    const newFactory = {
        name: req.body.name,
        email: req.body.email,
        phone_number: req.body.phone_number,
        city: req.body.city,
        state: req.body.state,
        company_type: 'factory'
    };
    console.log(newFactory)
    companyStore.add(newFactory, (err) => {
        if (err) throw err;
        res.json(newFactory);
    });
});

router.delete('/:id/delete', (req, res) => {
    let resultFactories = []
    companyStore.remove(req.params.id, (err) => {
        if (err) throw err;
    })
    companyStore.list((err, factories) => {
        factories.forEach((factory) => {
            if (factory.company_type === "factory") {
                resultFactories.push(factory)
            }
        })
        res.json(resultFactories);
    });
});

module.exports = router;
