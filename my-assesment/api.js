const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

async function request(path, { method = "GET", body } = {}) {
	let response;

	try {
		response = await fetch(`${API_BASE_URL}${path}`, {
			method,
			headers: body === undefined ? undefined : { "Content-Type": "application/json" },
			body: body === undefined ? undefined : JSON.stringify(body),
		});
	} catch (error) {
		if (error instanceof TypeError) {
			throw new Error(
				`Cannot connect to JSON Server at ${API_BASE_URL}. Start it with "npm run server".`,
				{ cause: error },
			);
		}

		throw error;
	}

	const text = response.status === 204 ? "" : await response.text();
	let data = null;

	if (text) {
		try {
			data = JSON.parse(text);
		} catch {
			data = text;
		}
	}

	if (!response.ok) {
		const details =
			typeof data === "string" ? data : data?.message || data?.error;
		throw new Error(
			details || `Request failed (${response.status} ${response.statusText})`,
		);
	}

	return { data };
}

const api = {
	get: (path) => request(path),
	post: (path, body) => request(path, { method: "POST", body }),
	put: (path, body) => request(path, { method: "PUT", body }),
	delete: (path) => request(path, { method: "DELETE" }),
};

export default api;
