export async function delasoftFetch(path, options = {}) {
  const base = process.env.DELASOFT_API_URL || 'https://api.delasoft.example';
  const key = process.env.DELASOFT_API_KEY;
  const url = `${base.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;

  const res = await fetch(url, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      ...(key ? { Authorization: `Bearer ${key}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: options.cache,
  });

  if (!res.ok) {
    const bodyText = await res.text().catch(() => '');
    const err = new Error(`Delasoft API error ${res.status}: ${bodyText}`);
    err.status = res.status;
    err.body = bodyText;
    throw err;
  }

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return res.json();
  return res.text();
}

export default delasoftFetch;
