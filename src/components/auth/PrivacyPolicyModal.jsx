import React from 'react';

export function PrivacyPolicyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-xl animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">
            Política de Tratamiento de Datos y Términos de Uso
          </h2>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
            aria-label="Cerrar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 prose prose-sm max-w-none prose-headings:text-slate-800 prose-p:text-slate-600 prose-a:text-[#1F3B5F] space-y-6">

          <p>
            <strong>Fecha de actualización:</strong> 14 de agosto de 2026
            <br />
            <strong>Versión:</strong> 1.1
          </p>

          <h3 className="text-lg font-bold text-slate-900 mt-6 mb-3">1. Responsable del tratamiento</h3>
          <p>
            El responsable del tratamiento de los datos personales recopilados mediante la plataforma <strong>morar.ok</strong> es Controller RMA SAS, identificado con NIT 901.831.578-9.
          </p>
          <p>
            La presente política establece las condiciones bajo las cuales se recopilan, almacenan, utilizan y protegen los datos personales suministrados por los usuarios de la plataforma, de conformidad con la Ley 1581 de 2012 y demás normas colombianas aplicables en materia de protección de datos personales.
          </p>

          <h3 className="text-lg font-bold text-slate-900 mt-8 mb-3">2. Datos personales que recopilamos</h3>
          <p>
            Para el funcionamiento de la plataforma, podremos recopilar y almacenar información proporcionada directamente por el usuario durante el proceso de evaluación, incluyendo:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>Nombre y apellidos del evaluador.</li>
            <li>Número de documento de identidad, cuando sea requerido.</li>
            <li>Información necesaria para la autenticación y gestión de la sesión.</li>
            <li>Coordenadas de geolocalización (GPS) asociadas a la edificación inspeccionada.</li>
            <li>Fotografías y evidencias capturadas durante el proceso de evaluación.</li>
            <li>Información técnica de la edificación, incluyendo características del sistema constructivo, nivel de daño y condiciones observables de elementos estructurales y no estructurales.</li>
            <li>Datos de contacto de terceros, tales como propietarios o responsables de las edificaciones, cuando sean suministrados por el usuario.</li>
            <li>Firma digitalizada o electrónica del usuario, cuando aplique.</li>
          </ul>
          <p className="mt-4">
            El usuario será responsable de contar con las autorizaciones que correspondan cuando suministre información o datos personales pertenecientes a terceros.
          </p>
          <p>
            No se recopilarán datos personales que no sean necesarios para las finalidades descritas en esta política.
          </p>

          <h3 className="text-lg font-bold text-slate-900 mt-8 mb-3">3. Finalidades del tratamiento y uso de la información</h3>
          <p>Los datos recopilados serán tratados para las siguientes finalidades:</p>
          <ol className="list-decimal pl-5 space-y-2 mt-2">
            <li>Crear y administrar la sesión de la persona que realiza la evaluación.</li>
            <li>Recopilar y organizar la información suministrada durante el proceso de evaluación visual de la edificación.</li>
            <li>Generar un informe de evaluación visual preliminar sobre las condiciones observadas durante la inspección posterior a un evento sísmico.</li>
            <li>Asociar la información recolectada durante la evaluación con la persona que realiza la inspección.</li>
            <li>Mantener, mejorar y garantizar el correcto funcionamiento de la plataforma.</li>
            <li>Fines estadísticos, académicos, investigativos y de mejora de la herramienta: la información técnica relacionada con las evaluaciones podrá ser analizada para generar estadísticas, realizar investigaciones, identificar patrones y mejorar el funcionamiento y desarrollo de la plataforma.</li>
            <li>Cumplir con las obligaciones legales que resulten aplicables.</li>
          </ol>
          <p className="mt-4">
            Cuando la información sea utilizada para fines estadísticos, académicos, investigativos o de mejora de la plataforma, se procurará su anonimización o agregación, de manera que no permita identificar directa o indirectamente al titular, a la persona inspeccionada o la ubicación específica del inmueble.
          </p>
          <p>
            Los datos personales no serán utilizados para finalidades incompatibles con las informadas en esta política, salvo que exista una autorización adicional del titular o una obligación legal que permita dicho tratamiento.
          </p>

          <h3 className="text-lg font-bold text-slate-900 mt-8 mb-3">4. Tratamiento y almacenamiento de la información</h3>
          <p>
            La información proporcionada por los usuarios durante el uso de la plataforma será recopilada, procesada y almacenada en las bases de datos y servicios tecnológicos utilizados por morar.ok para garantizar el funcionamiento de la plataforma.
          </p>
          <p>
            La información almacenada podrá incluir los datos utilizados para la creación y gestión de la cuenta del usuario, tales como nombre completo, número de documento y demás información necesaria para la autenticación y administración de la cuenta.
          </p>
          <p>
            Asimismo, la información suministrada durante el proceso de evaluación de la edificación será almacenada en los sistemas de información correspondientes. Esto puede incluir las respuestas proporcionadas en los formularios, información técnica de la edificación, coordenadas de geolocalización, fotografías, evidencias y demás información necesaria para generar y conservar el registro de la evaluación.
          </p>
          <p>
            La información podrá asociarse con la cuenta del usuario que realiza la evaluación, con el propósito de mantener la trazabilidad del proceso y generar el correspondiente informe.
          </p>
          <p>
            La información será conservada durante el tiempo necesario para cumplir las finalidades descritas en esta política o mientras exista una obligación legal que requiera su conservación.
          </p>
          <p>
            El acceso a la información estará restringido de acuerdo con los roles, permisos y mecanismos de seguridad establecidos para la plataforma.
          </p>
          <p>
            La información podrá ser almacenada y procesada mediante proveedores de servicios tecnológicos o infraestructura en la nube utilizada por la plataforma. En caso de que dichos servicios impliquen el almacenamiento o procesamiento de información fuera del territorio colombiano, se aplicarán las medidas y requisitos establecidos por la legislación colombiana en materia de protección de datos personales.
          </p>
          <p>
            Cuando se implementen cambios relevantes en los mecanismos de almacenamiento o tratamiento de la información que impliquen nuevas finalidades o modificaciones sustanciales en el tratamiento de los datos personales, la presente política podrá ser actualizada y se informará a los titulares de acuerdo con los mecanismos aplicables.
          </p>

          <h3 className="text-lg font-bold text-slate-900 mt-8 mb-3">5. Seguridad de la información</h3>
          <p>
            Controller RMA SAS implementará medidas técnicas, administrativas y organizativas razonables para proteger los datos personales y documentos almacenados frente a pérdida, alteración, acceso no autorizado, divulgación o uso indebido.
          </p>
          <p>
            El acceso a la información estará limitado de acuerdo con los roles, permisos y mecanismos de seguridad establecidos dentro de la plataforma.
          </p>
          <p>
            No obstante, ningún sistema tecnológico puede garantizar de manera absoluta la inexistencia de riesgos de seguridad, por lo que se adoptarán medidas razonables de acuerdo con la naturaleza de la información tratada y las capacidades de la plataforma.
          </p>

          <h3 className="text-lg font-bold text-slate-900 mt-8 mb-3">6. Confidencialidad</h3>
          <p>
            Las personas que intervengan en el tratamiento de los datos personales deberán mantener la confidencialidad de la información a la que tengan acceso y utilizarla únicamente para las finalidades autorizadas.
          </p>
          <p>
            Esta obligación permanecerá vigente de acuerdo con las disposiciones legales aplicables, incluso después de finalizar la relación con la plataforma o con el responsable del tratamiento.
          </p>

          <h3 className="text-lg font-bold text-slate-900 mt-8 mb-3">7. Fotografías, documentos y evidencias cargadas por los usuarios</h3>
          <p>
            Las fotografías y evidencias proporcionadas voluntariamente por los usuarios serán utilizadas como soporte del proceso de evaluación visual realizado mediante la plataforma.
          </p>
          <p>
            El usuario será responsable de garantizar que cuenta con los derechos, permisos o autorizaciones necesarios para tomar y almacenar fotografías de inmuebles privados o para suministrar información perteneciente a terceros.
          </p>
          <p>
            Las fotografías podrán contener elementos que permitan identificar directa o indirectamente una ubicación, inmueble o persona. Por esta razón, el usuario deberá evitar capturar información personal innecesaria cuando esta no sea relevante para el proceso de evaluación.
          </p>

          <h3 className="text-lg font-bold text-slate-900 mt-8 mb-3">8. Derechos de los titulares</h3>
          <p>
            De conformidad con la legislación colombiana, los titulares de los datos personales tienen derecho a:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>Conocer los datos personales que son objeto de tratamiento.</li>
            <li>Solicitar la actualización y rectificación de sus datos.</li>
            <li>Solicitar la supresión de sus datos cuando sea procedente.</li>
            <li>Solicitar información sobre el uso que se ha dado a sus datos personales.</li>
            <li>Presentar quejas ante la Superintendencia de Industria y Comercio cuando considere que se han vulnerado sus derechos.</li>
          </ul>
          <p className="mt-4">
            El ejercicio de estos derechos estará sujeto a las condiciones y excepciones establecidas por la legislación colombiana.
          </p>

          <h3 className="text-lg font-bold text-slate-900 mt-8 mb-3">9. Consultas y reclamos</h3>
          <p>
            El titular podrá realizar consultas o presentar reclamos relacionados con el tratamiento de sus datos personales mediante el siguiente canal:
          </p>
          <p className="font-semibold text-slate-800">
            Correo electrónico: <span className="font-normal text-slate-600">coordinacion@controller.com.co</span>
          </p>
          <p>
            Las solicitudes serán atendidas de conformidad con los procedimientos y términos establecidos en la legislación colombiana aplicable.
          </p>

          <div className="bg-[#fcf8e3] border border-[#faebcc] p-4 sm:p-5 rounded-lg mt-8 text-[#8a6d3b]">
            <h3 className="text-lg font-bold text-[#8a6d3b] mb-3 uppercase">
              10. ADVERTENCIA EXPRESA SOBRE EL ALCANCE
            </h3>
            <p className="mb-3">
              Esta herramienta está diseñada exclusivamente como una herramienta de evaluación visual preliminar posterior a un evento sísmico. Su objetivo es facilitar al usuario la recopilación y análisis inicial de información visible sobre una edificación y permitir la identificación de posibles señales de daño que puedan requerir una revisión más especializada.
            </p>
            <p className="mb-3">
              <strong>Este informe NO es un estudio de vulnerabilidad sísmica.</strong> Un concepto favorable de habitabilidad significa únicamente que, con base en lo observado visualmente, no se identificaron daños que comprometan la estabilidad de la edificación ni la seguridad inmediata de sus ocupantes bajo condiciones normales de servicio.
            </p>
            <p>
              Este concepto <strong>NO certifica, NO acredita y NO debe interpretarse como constancia</strong> de que la edificación cumple los requisitos de la Norma Colombiana de Diseño y Construcción Sismo Resistente NSR-10, ni de que posee capacidad suficiente para resistir el sismo de diseño correspondiente a su zona de amenaza sísmica y grupo de uso.
            </p>
          </div>

          <h3 className="text-lg font-bold text-slate-900 mt-8 mb-3">11. Conservación de los datos</h3>
          <p>
            Los datos personales y documentos serán conservados durante el tiempo necesario para cumplir las finalidades para las cuales fueron recopilados o mientras exista una obligación legal que requiera su conservación.
          </p>
          <p>
            Cuando los datos dejen de ser necesarios para las finalidades correspondientes y no exista una obligación legal de conservarlos, se podrán implementar medidas para su eliminación, anonimización o supresión, de acuerdo con los procedimientos aplicables.
          </p>

          <h3 className="text-lg font-bold text-slate-900 mt-8 mb-3">12. Actualización de la política</h3>
          <p>
            Controller RMA SAS podrá actualizar la presente política cuando resulte necesario debido a cambios en la legislación, en las funcionalidades de la plataforma, en las tecnologías utilizadas o en las finalidades del tratamiento.
          </p>
          <p>
            Cuando los cambios impliquen modificaciones relevantes en el tratamiento de los datos personales, se informará a los titulares de acuerdo con los mecanismos que resulten aplicables.
          </p>
          <p className="mt-4">
            <strong>Fecha de última actualización:</strong> 14 de agosto de 2026.
          </p>

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#1F3B5F] text-white font-medium rounded-xl hover:bg-[#152a45] transition-colors shadow-md"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
}