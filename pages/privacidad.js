// pages/privacidad.js

export default function Privacidad() {
  return (
    <div className="min-h-screen bg-black text-neutral-200">
      <main className="pt-28 pb-20 px-6 max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif mb-2">
          Política de Privacidad y Tratamiento de Datos Personales
        </h1>
        <p className="text-xs text-neutral-600 mb-8">
          Última actualización: agosto de 2026
        </p>

        <p className="text-neutral-400 leading-relaxed mb-8">
          En ShopTecnology respetamos tu privacidad y tratamos tus datos
          personales conforme a la Ley 1581 de 2012, el Decreto 1377 de 2013
          y demás normas colombianas sobre protección de datos personales
          (&ldquo;Habeas Data&rdquo;). Esta política explica qué información
          recopilamos, para qué la usamos y cómo puedes ejercer tus derechos.
        </p>

        <Section title="1. Responsable del tratamiento">
          <p>
            ShopTecnology es responsable del tratamiento de los datos
            personales que nos suministras a través de este Sitio.{" "}
            <em>
              [Razón social, NIT y datos de contacto formales pendientes de
              completar]
            </em>
            .
          </p>
        </Section>

        <Section title="2. Datos que recopilamos">
          <p>Dependiendo de cómo interactúes con el Sitio, podemos recopilar:</p>
          <ul className="list-disc ml-6 space-y-1">
            <li>Datos de identificación: nombre, cédula, correo, teléfono.</li>
            <li>Datos de entrega: dirección y ciudad.</li>
            <li>
              Datos de tu pedido: productos comprados, valores, método de
              pago y estado del pedido.
            </li>
            <li>
              Datos técnicos básicos generados por tu navegador al usar el
              Sitio.
            </li>
          </ul>
          <p>
            No solicitamos ni almacenamos datos completos de tarjetas de
            crédito o débito: los pagos se procesan directamente a través de
            nuestra pasarela de pagos (Wompi), que cuenta con sus propias
            políticas de seguridad y privacidad.
          </p>
        </Section>

        <Section title="3. Finalidad del tratamiento">
          <p>Usamos tus datos personales para:</p>
          <ul className="list-disc ml-6 space-y-1">
            <li>Gestionar tu cuenta y autenticar tu acceso al Sitio.</li>
            <li>Procesar tus pedidos, pagos y envíos.</li>
            <li>Brindarte soporte y atención al cliente.</li>
            <li>
              Enviarte comunicaciones relacionadas con tu pedido (confirmación,
              verificación de cuenta, recuperación de contraseña).
            </li>
            <li>
              Cumplir con obligaciones legales y contables aplicables al
              comercio electrónico en Colombia.
            </li>
          </ul>
        </Section>

        <Section title="4. Con quién compartimos tu información">
          <p>
            Para poder operar el Sitio, algunos datos se comparten con
            proveedores que nos prestan servicios bajo sus propias políticas
            de seguridad, únicamente para los fines aquí descritos:
          </p>
          <ul className="list-disc ml-6 space-y-1">
            <li>
              La plataforma que administra nuestro catálogo, inventario y
              pedidos (Delasoft).
            </li>
            <li>Nuestra pasarela de pagos (Wompi), para procesar tus pagos.</li>
            <li>
              Proveedores de correo electrónico transaccional, para enviarte
              notificaciones de tu cuenta y pedidos.
            </li>
            <li>
              Proveedores de almacenamiento de imágenes, si subes una foto de
              perfil.
            </li>
          </ul>
          <p>
            No vendemos ni alquilamos tus datos personales a terceros con
            fines publicitarios.
          </p>
        </Section>

        <Section title="5. Tus derechos como titular de los datos">
          <p>Como titular de tus datos personales, tienes derecho a:</p>
          <ul className="list-disc ml-6 space-y-1">
            <li>Conocer, actualizar y rectificar tus datos personales.</li>
            <li>
              Solicitar prueba de la autorización otorgada para el
              tratamiento de tus datos.
            </li>
            <li>
              Ser informado sobre el uso que se le ha dado a tus datos.
            </li>
            <li>
              Revocar la autorización y/o solicitar la supresión de tus datos,
              cuando no exista un deber legal o contractual que nos obligue a
              conservarlos.
            </li>
            <li>
              Presentar quejas ante la Superintendencia de Industria y
              Comercio (SIC) por infracciones a la ley de protección de datos.
            </li>
          </ul>
        </Section>

        <Section title="6. Cómo ejercer tus derechos">
          <p>
            Puedes actualizar tus datos básicos (nombre, teléfono, ciudad,
            dirección) directamente desde{" "}
            <a
              href="/usuario/perfilinfo"
              className="underline hover:text-neutral-100"
            >
              Mi cuenta → Información personal
            </a>
            . Para cualquier otra solicitud relacionada con tus datos
            personales (acceso, rectificación, supresión o revocatoria de la
            autorización), escríbenos por los medios indicados en{" "}
            <a href="/contacto" className="underline hover:text-neutral-100">
              Contacto
            </a>
            . Atenderemos tu solicitud dentro de los plazos establecidos por
            la ley.
          </p>
        </Section>

        <Section title="7. Seguridad de la información">
          <p>
            Implementamos medidas técnicas y organizativas razonables para
            proteger tus datos personales frente a acceso no autorizado,
            pérdida o alteración. Sin embargo, ningún sistema es
            completamente infalible, por lo que también te recomendamos
            proteger tu contraseña y cerrar sesión en dispositivos
            compartidos.
          </p>
        </Section>

        <Section title="8. Conservación de los datos">
          <p>
            Conservamos tus datos personales mientras mantengas una cuenta
            activa en el Sitio y, posteriormente, durante los plazos exigidos
            por la normativa comercial, fiscal y contable aplicable en
            Colombia.
          </p>
        </Section>

        <Section title="9. Menores de edad">
          <p>
            Este Sitio está dirigido a personas mayores de edad. No
            recopilamos intencionalmente datos personales de menores de edad
            sin el consentimiento de sus padres o representantes legales.
          </p>
        </Section>

        <Section title="10. Cambios a esta política">
          <p>
            Podemos actualizar esta política de privacidad en cualquier
            momento para reflejar cambios en nuestras prácticas o en la
            normativa aplicable. La versión vigente estará siempre disponible
            en esta página.
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
