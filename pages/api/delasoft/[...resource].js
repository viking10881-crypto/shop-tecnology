import delasoftFetch from '../../../lib/delasoftClient';

const READ_RESOURCES = new Set([
  'ping', 'products', 'categories', 'inventory', 'banners', 'discounts', 'customers',
  'auth/profile', 'sales/user/history', 'sales/user/stats',
]);
const WRITE_RESOURCES = new Set(['sales', 'discounts/validate', 'auth/register', 'auth/login', 'auth/verify', 'auth/resend-code']);
const UPDATE_RESOURCES = new Set(['auth/profile']);

export default async function handler(req, res) {
  const resource = Array.isArray(req.query.resource)
    ? req.query.resource.join('/')
    : req.query.resource;
  const queryIndex = req.url.indexOf('?');
  const query = queryIndex === -1 ? '' : req.url.slice(queryIndex);

  const allowed =
    req.method === 'GET'
      ? READ_RESOURCES.has(resource) || resource.startsWith('products/')
      : req.method === 'POST'
      ? WRITE_RESOURCES.has(resource)
      : req.method === 'PUT'
      ? UPDATE_RESOURCES.has(resource)
      : false;

  if (!allowed) {
    return res.status(404).json({ success: false, message: 'Recurso no disponible.' });
  }

  const hasBody = req.method === 'POST' || req.method === 'PUT';
  const forwardHeaders = {};
  if (req.headers.authorization) {
    forwardHeaders.Authorization = req.headers.authorization;
  }

  try {
    const data = await delasoftFetch(`/${resource}${query}`, {
      method: req.method,
      headers: forwardHeaders,
      body: hasBody ? req.body : undefined,
    });
    return res.status(200).json(data);
  } catch (error) {
    // If Delasoft returned a body, forward it (helps debugging rate limits / messages)
    if (error.body) {
      try {
        const parsed = JSON.parse(error.body);
        return res.status(error.status || 502).json(parsed);
      } catch (e) {
        return res.status(error.status || 502).send(error.body);
      }
    }
    return res.status(error.status || 502).json({
      success: false,
      message: 'No fue posible comunicarse con Delasoft.',
    });
  }
}
