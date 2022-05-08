const express = require('express');
const app = express();

const { logger } = require('./helpers/helperFunc');
const api = require('./routes/api');
const NODE_ENV = process.env.NODE_ENV || 'Local';

const port = process.env.PORT || 3000;
app.use(logger).use('/api', api).set('json spaces', 2);

if (require.main === module) {
	/* istanbul ignore next */
	app.listen(port, () => {
		console.log(`Server listening on port ${port} [Env:${NODE_ENV}]`);
	});
}

app.get('/', async (req, res) => {
	res.status(200).send({ message: "Welcome to nmpereira's api! Please use the /api/posts route" });
});

module.exports = app;
