import { PUBLIC_FORWARD } from '$env/static/public';
import type { EndpointArgMap, EndpointMap } from '..';

export default <M extends keyof EndpointMap, P extends keyof EndpointMap[M] & keyof EndpointArgMap>(
	body: {
		method: M;
		path: P;
	} & Record<string, unknown>,
	replaceArgs: Record<EndpointArgMap[P], string> & { query?: string },
	fetchFn: typeof fetch,
) =>
	fetchFn(PUBLIC_FORWARD, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			method: body.method,
			path: `${body.path.replace(/:(\w+)/g, (_, k) => replaceArgs[k as keyof typeof replaceArgs] ?? '')}${replaceArgs.query ? `?${replaceArgs.query}` : ''}`,
			body: Object.entries(body).reduce((acc, [k, v]) => {
				if (k === 'method' || k === 'path') return acc;
				(acc as Record<string, unknown>)[k] = v;
				return acc;
			}, {}),
		}),
	}).then((r) => {
		return r.ok
			? r.text().then((text) => {
					console.log(`${body.method} ${body.path} responded with: ${r.status}`, text);

					if (!text) return null;
					return JSON.parse(text) as EndpointMap[M][P] | null;
				})
			: r.text().then((text) => {
					console.log(text);
					return null;
				});
	});
