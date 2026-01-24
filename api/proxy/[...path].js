const { URLSearchParams } = require('url');

const normalizeBaseUrl = (url) => (url || '').replace(/\/+$/, '');

const buildTargetUrl = (req) => {
  const baseUrl = normalizeBaseUrl(process.env.BACKEND_URL || process.env.REACT_APP_API_URL);
  const pathParts = Array.isArray(req.query.path) ? req.query.path : [req.query.path].filter(Boolean);
  const path = pathParts.join('/');

  const params = new URLSearchParams();
  Object.entries(req.query || {}).forEach(([key, value]) => {
    if (key === 'path') return;
    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, item));
      return;
    }
    if (value !== undefined) {
      params.append(key, value);
    }
  });

  const bypassToken = getBypassToken();
  if (bypassToken) {
    params.set('x-vercel-protection-bypass', bypassToken);
  }

  const queryString = params.toString();
  return `${baseUrl}/${path}${queryString ? `?${queryString}` : ''}`;
};

const getBypassToken = () => process.env.VERCEL_PROTECTION_BYPASS || '';

const getRequestBody = async (req) => {
  if (req.method === 'GET' || req.method === 'HEAD') {
    return undefined;
  }

  if (req.body) {
    if (Buffer.isBuffer(req.body)) {
      return req.body;
    }
    if (typeof req.body === 'string') {
      return Buffer.from(req.body);
    }
    return Buffer.from(JSON.stringify(req.body));
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  if (chunks.length === 0) {
    return undefined;
  }

  return Buffer.concat(chunks);
};

const filterRequestHeaders = (headers) => {
  const filtered = { ...headers };
  delete filtered.host;
  delete filtered.connection;
  delete filtered['content-length'];
  return filtered;
};

const writeResponse = async (res, response) => {
  res.statusCode = response.status;

  response.headers.forEach((value, key) => {
    if (['content-encoding', 'content-length', 'transfer-encoding', 'connection'].includes(key)) {
      return;
    }
    res.setHeader(key, value);
  });

  const buffer = Buffer.from(await response.arrayBuffer());
  res.end(buffer);
};

module.exports = async (req, res) => {
  const baseUrl = normalizeBaseUrl(process.env.BACKEND_URL);
  if (!baseUrl) {
    res.statusCode = 500;
    res.end('BACKEND_URL is not configured.');
    return;
  }

  const bypassToken = getBypassToken();
  if (!bypassToken) {
    res.statusCode = 500;
    res.end('VERCEL_PROTECTION_BYPASS is not configured.');
    return;
  }

  try {
    const targetUrl = buildTargetUrl(req);
    const body = await getRequestBody(req);

    const headers = filterRequestHeaders(req.headers);
    headers['x-vercel-protection-bypass'] = bypassToken;
    if (!headers['content-type'] && body) {
      headers['content-type'] = 'application/json';
    }

    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body
    });

    await writeResponse(res, response);
  } catch (error) {
    res.statusCode = 502;
    res.end(error.message || 'Proxy request failed.');
  }
};
