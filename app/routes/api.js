const express = require('express');
const router = express.Router();
const { sorter, requestApi, checkMulti, removeDuplicates } = require('../helpers/helperFunc');

router.get('/', async (_, res) => {
	res.status(200).send({ message: "Welcome to nmpereira's api! please use the /api/posts route" });
});
router.get('/ping', async (_, res) => {
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
		// if tags are not specified
		res.status(400).send({
			error: 'Tags parameter is required'
		});
		return;
	} else if (!allowedSortByParams.includes(sortBy)) {
		// if sortBy is not in the list of acceptable parameters
		res.status(400).send({
			error: 'sortBy parameter is invalid'
		});
		return;
	} else if (!allowedDirectionParams.includes(direction)) {
		// if Direction is not in the list of acceptable parameters
		res.status(400).send({
			error: 'direction parameter is invalid'
		});
		return;
	}
	try {
		let apiDataCombined = [];

		// runs all the requests simultaneously and waits for all the responses before sending to client
		const promises = [];
		for (const tag of checkMulti(tags)) {
			promises.push(requestApi(tag));
		}
		const resolvedPromises = await Promise.all(promises);
		for (let apiData of resolvedPromises) {
			apiData = apiData.data.posts;
			apiDataCombined = removeDuplicates(apiData, apiDataCombined);
		}
		// sorts the Json object based on either default or specified params
		sorter(apiDataCombined, sortBy, direction);

		res.status(200).send({ posts: apiDataCombined });
	} catch (err) {
		/* istanbul ignore next */
		res.status(500).json({ message: err.message });
	}
});
module.exports = router;
