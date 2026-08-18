import React from 'react';
import delasoftFetch from '../lib/delasoftClient';

const money = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

function getItems(response) {
  if (Array.isArray(response)) return response;
  return response?.data || response?.results || [];
}

function productImage(product) {
  const image = product?.image_url || product?.image || product?.images?.[0];
  return typeof image === 'string' ? image : image?.url || image?.image_url;
}

export default function DelasoftPage({ products, categories, error }) {
  return (
    <main style={{ maxWidth: 1120, margin: '0 auto', padding: '48px 24px', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ marginBottom: 32 }}>
        <p style={{ color: '#b45309', fontWeight: 700, letterSpacing: 1 }}>TIENDA CONECTADA A DELASOFT</p>
        <h1 style={{ margin: '8px 0', fontSize: 36 }}>Productos</h1>
        <p style={{ color: '#4b5563' }}>Catálogo sincronizado desde la API pública de Delasoft.</p>
      </header>

      {error ? (
        <div style={{ padding: 16, borderRadius: 12, background: '#fef2f2', color: '#991b1b' }}>
          No fue posible cargar el catálogo: {error}
        </div>
      ) : (
        <>
          {categories.length > 0 && (
            <nav style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }} aria-label="Categorías">
              {categories.map((category) => (
                <span key={category.id || category.slug || category.name} style={{ padding: '8px 12px', borderRadius: 999, background: '#f3f4f6', fontSize: 14 }}>
                  {category.name}
                </span>
              ))}
            </nav>
          )}

          {products.length === 0 ? (
            <p style={{ color: '#6b7280' }}>No hay productos publicados todavía.</p>
          ) : (
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
              {products.map((product) => {
                const image = productImage(product);
                const price = product.sale_price ?? product.price ?? product.final_price;
                return (
                  <article key={product.id} style={{ overflow: 'hidden', border: '1px solid #e5e7eb', borderRadius: 16, background: '#fff' }}>
                    {image ? (
                      <img src={image} alt={product.name || 'Producto'} style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', display: 'block' }} />
                    ) : (
                      <div style={{ aspectRatio: '1 / 1', background: '#f3f4f6' }} />
                    )}
                    <div style={{ padding: 16 }}>
                      <h2 style={{ margin: 0, fontSize: 17 }}>{product.name || product.title || 'Producto sin nombre'}</h2>
                      {price !== undefined && <p style={{ margin: '10px 0 0', fontWeight: 700 }}>{money.format(Number(price))}</p>}
                    </div>
                  </article>
                );
              })}
            </section>
          )}
        </>
      )}
    </main>
  );
}

export async function getServerSideProps() {
  try {
    const [productsResponse, categoriesResponse] = await Promise.all([
      delasoftFetch('/products?page=1&limit=24'),
      delasoftFetch('/categories'),
    ]);

    return {
      props: {
        products: getItems(productsResponse),
        categories: getItems(categoriesResponse),
        error: null,
      },
    };
  } catch (err) {
    return {
      props: {
        products: [],
        categories: [],
        error: err.message || String(err),
      },
    };
  }
}
