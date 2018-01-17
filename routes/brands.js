const express = require('express');
const companyStore = require('json-fs-store')('store/companies');
const router = express.Router();

router.get('/', (req, res) => {
	companyStore.list((err, brands) => {
		let resultBrands = []
		brands.forEach((brand) => {
			debugger
			if (brand.company_type === "brand") {
				resultBrands.push(brand)
			}
		})
		res.json(resultBrands);
	});
});

module.exports = router;