// pages/cookies.js

export default function Cookies() {
  return (
    <div className="min-h-screen bg-black text-neutral-200">
      <main className="pt-28 pb-20 px-6 max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif mb-2">
          Política de Cookies
        </h1>
        <p className="text-xs text-neutral-600 mb-8">
          Última actualización: agosto de 2026
        </p>

        <p className="text-neutral-400 leading-relaxed mb-8">
          Esta política explica qué cookies y tecnologías de almacenamiento
          local usa ShopTecnology, para qué las usamos y cómo puedes
          administrarlas.
        </p>

        <Section title="1. ¿Qué son las cookies?">
          <p>
            Las cookies son pequeños archivos que un sitio web guarda en tu
            navegador. Además de cookies, este Sitio utiliza{" "}
            <strong className="text-neutral-200">
              almacenamiento local del navegador
            </strong>{" "}
            (localStorage) para recordar información como tu sesión iniciada
            o los productos en tu carrito, sin necesidad de guardarlos en
            nuestros servidores.
          </p>
        </Section>

        <Section title="2. Qué guardamos y para qué">
          <ul className="list-disc ml-6 space-y-1">
            <li>
              <strong className="text-neutral-200">Estrictamente necesarias:</strong>{" "}
              mantienen tu sesión iniciada mientras navegas, para que no
              tengas que volver a ingresar tu contraseña en cada página.
            </li>
            <li>
              <strong className="text-neutral-200">Funcionales:</strong>{" "}
              recuerdan el contenido de tu carrito de compras entre visitas,
              aunque cierres el navegador.
            </li>
          </ul>
          <p>
            Actualmente no utilizamos cookies de publicidad ni de terceros
            para rastrearte fuera de este Sitio.
          </p>
        </Section>

        <Section title="3. Cookies de terceros">
          <p>
            Algunos servicios que usamos para operar el Sitio (como nuestra
            pasarela de pagos) pueden establecer sus propias cookies durante
            el proceso de pago, conforme a sus propias políticas de
            privacidad.
          </p>
        </Section>

        <Section title="4. Cómo administrar o desactivar cookies">
          <p>
            Puedes eliminar o bloquear las cookies y el almacenamiento local
            desde la configuración de tu navegador. Ten en cuenta que si
            desactivas las cookies estrictamente necesarias, es posible que
            no puedas iniciar sesión ni mantener productos en tu carrito
            entre visitas.
          </p>
        </Section>

        <Section title="5. Cambios a esta política">
          <p>
            Podemos actualizar esta política de cookies cuando cambien las
            tecnologías que usamos en el Sitio. La versión vigente estará
            siempre disponible en esta página.
          </p>
        </Section>
      </main>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-neutral-100 mb-2">{title}</h2>
      <div className="text-neutral-400 leading-relaxed space-y-3">
        {children}
      </div>
    </section>
  );
}
