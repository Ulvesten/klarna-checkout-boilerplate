const app = require('../../loaders/express-handlebars');
const { createOrder } = require('../../services/server/klarna');

app.get('/', async function (req, res, next) {
	const klarnaJsonResponse = await createOrder();
	const html_snippet = klarnaJsonResponse.html_snippet;
	res.render('checkout', {
		klarna_checkout: html_snippet
	});
});

module.exports = app;
