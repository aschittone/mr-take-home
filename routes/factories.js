const express = require('express');
const companyStore = require('json-fs-store')('store/companies');
const router = express.Router();

router.get('/', (req, res) => {
    const resultFactories = [];
    companyStore.list((err, factories) => {
        factories.forEach((factory) => {
            factory.company_type === "factory" ? resultFactories.push(factory) : null; // find and send only factories
        });
        res.json(resultFactories);
    });
});

router.get('/search', (req, res) => {
    const searchQuery = req.query.q;

    const resultFactory = [];
    if (!searchQuery) return res.sendStatus(404);


    companyStore.list((err, factories) => {
        for (let i = 0; i < factories.length; i++) {
            if (factories[i].name === searchQuery && factories[i].company_type === "factory") {
                resultFactory.push(factories[i]);
                break;
            };
        }
        resultFactory.length === 1 ? res.json(resultFactory) : res.sendStatus(404);
    });
});

router.get('/:id', (req, res) => {
    companyStore.load(req.params.id, (err, factory) => {
        if (err) throw err;
        res.json(factory);
    });
});

router.post('/', (req, res) => {
    if (!req.body.name) return res.sendStatus(400);
    const newFactory = {
        name: req.body.name,
        email: req.body.email,
        phone_number: req.body.phone_number,
        city: req.body.city,
        state: req.body.state,
        company_type: 'factory'
    };
    companyStore.add(newFactory, (err) => {
        if (err) throw err;
        res.json(newFactory);
    });
});

router.delete('/:id', (req, res) => {
    let resultFactories = [];
    companyStore.remove(req.params.id, (err) => {
        if (err) throw err;
    })

    // resend new list of just factories
    companyStore.list((err, factories) => {
        factories.forEach((factory) => {
            factory.company_type === "factory" ? resultFactories.push(factory) : null;
        })
        res.json(resultFactories);
    });
});

module.exports = router;
