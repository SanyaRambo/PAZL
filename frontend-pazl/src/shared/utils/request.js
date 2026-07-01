export async function request (url, method, data) {
	
	const res = await fetch(url, {
		headers: {
			'content-type': 'application/json'
		},
		method: method || 'GET',
		body: data ? JSON.stringify(data) : undefined,
		credentials: 'include'
	});



	return res.json()

}
