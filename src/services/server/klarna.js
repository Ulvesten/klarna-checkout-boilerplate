import fetch from 'node-fetch';

function getKlarnaAuth() {
	const username = process.env.PUBLIC_KEY;
	const password = process.env.SECRET_KEY;
	const auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
	return auth;
}

// 1. Add async createOrder function that returns Klarna response.json()
async function createOrder() {
	const path = '/checkout/v3/orders';
	const auth = getKlarnaAuth();
	const url = process.env.BASE_URL + path; // https://api.playground.klarna.com/checkout/v3/orders
	const method = 'POST';
	const headers = {
		'Content-Type': 'application/json',
		Authorization: auth
	};

	const payload = {
		purchase_country: 'SE',
		purchase_currency: 'SEK',
		locale: 'sv-SE',
		order_amount: 50000,
		order_tax_amount: 4545,
		order_lines: [
			{
				type: 'physical',
				reference: '19-402-USA',
				name: 'Red T-Shirt',
				quantity: 5,
				quantity_unit: 'pcs',
				unit_price: 10000,
				tax_rate: 1000,
				total_amount: 50000,
				total_discount_amount: 0,
				total_tax_amount: 4545
			}
		],
		merchant_urls: {
			terms: 'https://www.example.com/terms.html',
			checkout: 'https://www.example.com/checkout.html',
			confirmation: `${process.env.CONFIRMATION_URL}/confirmation?order_id={checkout.order.id}`,
			push: 'https://www.example.com/api/push'
		}
	};

	const body = JSON.stringify(payload);
	const response = await fetch(url, { method, headers, body });
	if (response.status === 200 || response.status === 201) {
		const jsonResponse = await response.json();
		return jsonResponse;
	} else {
		console.error('Error ', response.status, response.statusText);
		return {
			html_snippet: `<h1>${response.status} ${response.statusText}</h1>`
		};
	}
}

// 2. Add async retrieveOrder function that returns Klarna response.json()
async function retrieveOrder(id) {
	const path = `/checkout/v3/orders/${id}`;
	const auth = getKlarnaAuth();
	const url = process.env.BASE_URL + path;
	const method = 'GET';
	const headers = {
		'Content-Type': 'application/json',
		Authorization: auth
	};

	const response = await fetch(url, { method, headers });

	if (response.status === 200 || response.status === 201) {
		const jsonResponse = await response.json();
		return jsonResponse;
	} else {
		console.error('Error ', response.status, response.statusText);
		return {
			html_snippet: `<h1>${response.status} ${response.statusText}</h1>`
		};
	}
}

// 3. export createOrder and retrieveOrder below, and use them in api/client/index.js and api/client/confirmation.js
module.exports = { getKlarnaAuth, createOrder, retrieveOrder };
