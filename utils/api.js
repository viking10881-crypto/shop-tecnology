// Frontend/utils/api.js
const API = '/api/delasoft';

const unwrap = (payload) => payload?.data ?? payload?.results ?? payload;

const imageUrl = (product) => {
  const image = product?.image_url || product?.image || product?.images?.[0];
  return typeof image === 'string' ? image : image?.url || image?.image_url || null;
};

export const normalizeProduct = (product = {}) => ({
  ...product,
  descripcion: product.description || product.descripcion || product.short_description || '',
  subtitulo: product.subtitle || product.subtitulo || '',
  nombre: product.name || product.nombre || product.title || 'Producto',
  precio: product.sale_price ?? product.price ?? product.final_price ?? product.precio ?? 0,
  marca: product.brand || product.marca || product.category_name || '',
  imagen_principal: imageUrl(product),
  imagenes: product.images || product.imagenes || [],
  variantes: product.variants || product.variantes || [],
  creado_en: product.created_at || product.creado_en,
});

async function request(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const payload = await res.json().catch(() => null);
  if (!res.ok) throw new Error(payload?.message || 'No fue posible cargar los datos de Delasoft.');
  return unwrap(payload);
}

export async function fetchProducts(params = '') {
  const products = await request(`/products${params}`);
  return Array.isArray(products) ? products.map(normalizeProduct) : products;
}

export async function fetchProduct(id) {
  return normalizeProduct(await request(`/products/${id}`));
}

export async function fetchCategories() {
  return request('/categories');
}

export async function createSale(payload) {
  return request('/sales', { method: 'POST', body: JSON.stringify(payload) });
}

export async function registerCustomer(payload) {
  return request('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
}

export async function verifyEmail(email, code) {
  return request('/auth/verify', { method: 'POST', body: JSON.stringify({ email, code }) });
}

export async function resendVerificationCode(email) {
  return request('/auth/resend-code', { method: 'POST', body: JSON.stringify({ email }) });
}

const authHeaders = (token) => ({ Authorization: `Bearer ${token}` });

export async function fetchMyProfile(token) {
  return request('/auth/profile', { headers: authHeaders(token) });
}

export async function updateMyProfile(token, { name, phone, city, address }) {
  return request('/auth/profile', {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ name, phone, city, address }),
  });
}

export async function fetchMyOrders(token) {
  return request('/sales/user/history', { headers: authHeaders(token) });
}

export async function fetchMyOrderStats(token) {
  const payload = await request('/sales/user/stats', { headers: authHeaders(token) });
  return payload?.summary ?? payload;
}
