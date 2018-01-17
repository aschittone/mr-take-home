const express = require('express');
const companyStore = require('json-fs-store')('store/companies');
const router = express.Router();

router.get('/', (req, res) => {
	let resultBrands = []
	companyStore.list((err, brands) => {
		brands.forEach((brand) => {
			if (brand.company_type === "brand") {
				resultBrands.push(brand)
			}
		})
		res.json(resultBrands);
	});
});

router.get('/search', (req, res) => {
	const searchQuery = req.query.q;
	let resultBrand = []
	if (!searchQuery) return res.sendStatus(404);
	companyStore.list((err, brands) => {
		brands.forEach((brand, idx) => {
			if (brand.name === searchQuery && brand.company_type === "brand") {
				return resultBrand.push(brand)
			}
		});
		resultBrand.length >= 1 ? res.send(resultBrand) : res.sendStatus(404);
	});
});

router.get('/:id', (req, res) => {
	companyStore.load(req.params.id, (err, brand) => {
		if (err) throw err;
		res.json(brand);
	});
});

router.post('/', (req, res) => {
	if (!req.body) return res.sendStatus(400);
	const newBrand = {
		name: req.body.name,
		email: req.body.email,
		phone_number: req.body.phone_number,
		city: req.body.city,
		state: req.body.state,
		company_type: 'brand'
	};
	companyStore.add(newBrand, err => {
		if (err) throw err;
		res.json(newBrand);
	});
});

router.delete('/:id/delete', (req, res) => {
	companyStore.remove(req.params.id, (err) => {
		if (err) throw err;
	})
	companyStore.list((err, brands) => {
		res.json(brands)
	})
})

module.exports = router;