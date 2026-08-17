import React from 'react';
import delasoftFetch from '../lib/delasoftClient';

export default function DelasoftPage({ data, error }) {
  if (error) return <div>Error: {error}</div>;
  return (
    <div style={{ padding: 24 }}>
      <h1>Delasoft — Datos de ejemplo</h1>
      <pre style={{ whiteSpace: 'pre-wrap', background: '#f6f8fa', padding: 12 }}>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    // Ajusta la ruta del recurso según la API real de Delasoft
    const data = await delasoftFetch('/v1/example');
    return { props: { data } };
  } catch (err) {
    return { props: { error: err.message || String(err) } };
  }
}
