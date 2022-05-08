const axios = require('axios');
const NodeCache = require('node-cache');
const moment = require('moment');
const myCache = new NodeCache({ stdTTL: 5, checkperiod: 120 });

/* istanbul ignore next */
const requestApi = async (tag) => {
	const url = `https://api.hatchways.io/assessment/blog/posts`;
	const urlWithParams = `${url}?tag=${tag}`;
	// checks if the request is in cache
	const value = myCache.get(tag);
	if (value != undefined) {
		console.log(
			`Using cached data for ${urlWithParams} | expiring in ${(myCache.getTtl(tag) - new Date()) / 1000} seconds`
		);
		return { data: value };
	}
	// hits the hatchways api to get new data if not in cache
	const result = await axios.get(urlWithParams);
	console.log(`Sending request to ${urlWithParams} at: ${moment().format()}`);
	myCache.set(tag, result.data);

	return result;
};
// sorts the objects based on sortBy and Direction
const sorter = (data, params, type) => {
	return data.sort((a, b) => (type === 'asc' ? a[params] - b[params] : b[params] - a[params]));
};
// splits comma separated strings into an array of strings, while removing duplicates
const checkMulti = (input) => {
	return [ ...new Set(input.split(',')) ];
};

// remove duplicated data from multiple combied requests
const removeDuplicates = (newData, oldData) => {
	const idSet = new Map();
	[ ...oldData, ...newData ].forEach((data) => idSet.set(data.id, data));
	return [ ...idSet.values() ];
};

// logs information about request on the server
/* istanbul ignore next */
const logger = (req, _, next) => {
	console.log(
		`${req.method}: '${req.protocol}://${req.get(
			'host'
		)}${req.originalUrl}' at: '${moment().format()}' from ${req.ip ||
			req.headers['x-forwarded-for'] ||
			req.socket.remoteAddress ||
			null}`
	);
	next();
};

module.exports = { requestApi, sorter, checkMulti, removeDuplicates, logger };
