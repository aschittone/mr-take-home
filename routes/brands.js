const express = require('express');
const companyStore = require('json-fs-store')('store/companies');
const router = express.Router();

router.get('/', (req, res) => {
	const resultBrands = [];
	companyStore.list((err, brands) => {
		brands.forEach((brand) => {
			brand.company_type === "brand" ? resultBrands.push(brand) : null; // find and send only brands
		});
		res.json(resultBrands);
	});
});

router.get('/search', (req, res) => {
	const searchQuery = req.query.q;
	const resultBrand = [];
	if (!searchQuery) return res.sendStatus(404);
	companyStore.list((err, brands) => {
		for (let i = 0; i < brands.length; i++) {
			if (brands[i].name === searchQuery && brands[i].company_type === "brand") {
				resultBrand.push(brands[i]);
				break;
			};
		};
		resultBrand.length === 1 ? res.json(resultBrand) : res.sendStatus(404);
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
	let resultBrands = [];
	companyStore.remove(req.params.id, (err) => {
		if (err) throw err;
	})

	// resend new list of just brands
	companyStore.list((err, brands) => {
		brands.forEach((brand) => {
			brand.company_type === "brand" ? resultBrands.push(brand) : null;
		});
	});
	res.json(resultBrands);
});

module.exports = router;