const express = require('express');
const router = express.Router();

const { sorter, requestApi, checkMulti, removeDuplicates } = require('../helpers/helperFunc');

router.get('/', async (req, res) => {
	res.status(200).send({ message: "Welcome to nmpereira's api! please use the /api/posts route" });
});
router.get('/ping', async (req, res) => {
	res.status(200).send({ success: true });
});

router.get('/posts/:tags?/:sortBy?/:direction?', async (req, res) => {
	// defaulting to sortBy ='id' and direction ='asc'
	let tags = req.query.tags;
	let sortBy = req.query.sortBy || 'id';
	let direction = req.query.direction || 'asc';

	sortBy = sortBy.toLowerCase();
	direction = direction.toLowerCase();
	// List of acceptable params. Should give an error message if param not in this list
	const allowedSortByParams = [ 'id', 'likes', 'popularity', 'reads' ];
	const allowedDirectionParams = [ 'asc', 'desc' ];
	if (tags === undefined) {
		res.status(400).send({
			error: 'Tags parameter is required'
		});
		return;
	}
	try {
		let apiData;
		let apiDataCombined = [];

		let promises = [];
		for (const tag of checkMulti(tags)) {
			promises.push(requestApi(tag));
		}
		const resolvedPromises = await Promise.all(promises);
		for (let apiData of resolvedPromises) {
			apiData = apiData.data.posts;

			apiDataCombined = removeDuplicates(apiData, apiDataCombined);
		}

		sorter(apiDataCombined, sortBy, direction);
		if (!allowedSortByParams.includes(sortBy)) {
			res.status(400).send({
				error: 'sortBy parameter is invalid'
			});
		} else if (!allowedDirectionParams.includes(direction)) {
			res.status(400).send({
				error: 'direction parameter is invalid'
			});
		} else {
			res.status(200).send({ posts: apiDataCombined });
		}
	} catch (err) {
		/* istanbul ignore next */
		res.status(500).json({ message: err.message });
	}
});
module.exports = router;
