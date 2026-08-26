// pages/terminos.js

export default function Terminos() {
  return (
    <div className="min-h-screen bg-black text-neutral-200">
      <main className="pt-28 pb-20 px-6 max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif mb-2">
          Términos y Condiciones
        </h1>
        <p className="text-xs text-neutral-600 mb-8">
          Última actualización: agosto de 2026
        </p>

        <p className="text-neutral-400 leading-relaxed mb-8">
          Estos Términos y Condiciones regulan el acceso y uso de{" "}
          <strong className="text-neutral-200">ShopTecnology</strong> (el
          &ldquo;Sitio&rdquo;), operado en Colombia. Al navegar, registrarte o
          realizar una compra en el Sitio, aceptas los términos descritos a
          continuación. Si no estás de acuerdo, te pedimos no utilizar el
          Sitio.
        </p>

        <Section title="1. Quiénes somos">
          <p>
            ShopTecnology es una tienda en línea dedicada a la venta de
            tecnología, audio y accesorios electrónicos.{" "}
            <em>
              [Razón social, NIT y domicilio del comercio pendientes de
              completar]
            </em>
            . Puedes contactarnos por los medios indicados en la sección{" "}
            <a href="/contacto" className="underline hover:text-neutral-100">
              Contacto
            </a>
            .
          </p>
        </Section>

        <Section title="2. Productos, precios y disponibilidad">
          <p>
            Los precios se muestran en pesos colombianos (COP) e incluyen los
            impuestos aplicables, salvo que se indique lo contrario. Nos
            reservamos el derecho de modificar precios y descripciones sin
            previo aviso; el precio válido para tu compra es el vigente al
            momento de confirmar el pedido. Todas las compras están sujetas a
            disponibilidad de inventario. Si un producto se agota después de
            confirmado tu pedido, te contactaremos para ofrecerte un
            reemplazo, un reembolso o el tiempo de espera estimado.
          </p>
        </Section>

        <Section title="3. Proceso de compra y medios de pago">
          <p>
            El pedido se confirma una vez completas el proceso de pago a
            través de nuestra pasarela de pagos (Wompi) u otros medios
            habilitados en el Sitio. Es tu responsabilidad verificar que los
            datos de tu pedido (productos, cantidades, dirección de entrega)
            sean correctos antes de confirmar la compra.
          </p>
        </Section>

        <Section title="4. Envíos y tiempos de entrega">
          <p>
            Los tiempos de entrega informados son estimados y pueden variar
            según la ciudad de destino, la disponibilidad del transportador y
            causas de fuerza mayor. Te notificaremos si se presenta algún
            retraso relevante frente al tiempo estimado inicialmente.
          </p>
        </Section>

        <Section title="5. Derecho de retracto">
          <p>
            De acuerdo con el artículo 47 de la Ley 1480 de 2011 (Estatuto
            del Consumidor), por tratarse de una venta a distancia tienes
            derecho a retractarte de tu compra dentro de los{" "}
            <strong className="text-neutral-200">
              cinco (5) días hábiles
            </strong>{" "}
            siguientes a la entrega del producto, sin necesidad de justificar
            tu decisión. Para ejercer este derecho, escríbenos por los
            canales de la sección{" "}
            <a href="/contacto" className="underline hover:text-neutral-100">
              Contacto
            </a>{" "}
            indicando tu número de pedido. El producto debe devolverse sin
            uso, con su empaque, accesorios y manuales originales. El costo
            de devolución del producto corre por cuenta del consumidor,
            salvo que el producto no corresponda a lo solicitado.
          </p>
        </Section>

        <Section title="6. Garantías">
          <p>
            Todos los productos cuentan con la garantía legal mínima prevista
            en la Ley 1480 de 2011, que te protege frente a defectos de
            calidad, idoneidad o seguridad, adicional a cualquier garantía
            comercial ofrecida por el fabricante. Para hacerla efectiva,
            contáctanos indicando el producto, la fecha de compra y una
            descripción de la falla.
          </p>
        </Section>

        <Section title="7. Cambios y devoluciones">
          <p>
            Además del derecho de retracto legal, aceptamos cambios dentro de
            los primeros siete (7) días calendario posteriores a la entrega,
            siempre que el producto esté sin uso, en su empaque original y
            con todos sus accesorios. Consulta el detalle en nuestro{" "}
            <a href="/ayuda" className="underline hover:text-neutral-100">
              Centro de Ayuda
            </a>
            .
          </p>
        </Section>

        <Section title="8. Cuenta de usuario">
          <p>
            Al crear una cuenta te comprometes a proporcionar información
            veraz y a mantener la confidencialidad de tu contraseña. Eres
            responsable de la actividad realizada desde tu cuenta.
            Notifícanos de inmediato si detectas un uso no autorizado.
          </p>
        </Section>

        <Section title="9. Propiedad intelectual">
          <p>
            Las marcas, logotipos, textos, imágenes y demás contenidos del
            Sitio son propiedad de ShopTecnology o de sus respectivos
            titulares. Está prohibida su reproducción, distribución o uso
            comercial sin autorización previa y escrita.
          </p>
        </Section>

        <Section title="10. Limitación de responsabilidad">
          <p>
            ShopTecnology no será responsable por daños indirectos derivados
            del uso del Sitio, ni por fallas ocasionadas por terceros (redes
            de pago, proveedores logísticos, proveedores de infraestructura)
            que estén fuera de nuestro control razonable.
          </p>
        </Section>

        <Section title="11. Modificaciones">
          <p>
            Podemos actualizar estos Términos y Condiciones en cualquier
            momento. Los cambios entran en vigor desde su publicación en esta
            página. Te recomendamos revisarla periódicamente.
          </p>
        </Section>

        <Section title="12. Ley aplicable y jurisdicción">
          <p>
            Estos términos se rigen por las leyes de la República de
            Colombia. Cualquier controversia se someterá a las autoridades
            judiciales o administrativas competentes, incluida la
            Superintendencia de Industria y Comercio (SIC) en materia de
            protección al consumidor.
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
