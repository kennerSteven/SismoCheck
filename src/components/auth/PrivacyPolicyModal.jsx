import React from 'react';

export function PrivacyPolicyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">Política de Tratamiento de Datos Personales</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 prose prose-sm max-w-none prose-headings:text-slate-800 prose-p:text-slate-600 prose-a:text-[#1F3B5F] space-y-6">
          <p><strong>Fecha de actualización:</strong> 12 de agosto de 2026<br/>
          <strong>Versión:</strong> 1.0</p>

          <h3 className="text-lg font-bold text-slate-900 mt-6 mb-3">1. Responsable del tratamiento</h3>
          <p>El responsable del tratamiento de los datos personales recopilados mediante esta plataforma es:</p>
          <ul className="list-disc pl-5 space-y-3 mt-2 text-slate-600">
            <li><strong>Responsable:</strong> Controller RMA SAS</li>
            <li><strong>NIT:</strong> 901.831.578-9</li>
            <li><strong>Correo electrónico:</strong> coordinacion@controller.com.co</li>
            <li><strong>Dirección:</strong> Carrera 55 # 152b - 68</li>
          </ul>
          <p className="mt-4 text-slate-600">La presente política se establece de conformidad con la Ley 1581 de 2012 y las demás normas colombianas aplicables en materia de protección de datos personales.</p>

          <h3 className="text-lg font-bold text-slate-900 mt-8 mb-3">2. Datos personales que recopilamos</h3>
          <p className="text-slate-600">Para el funcionamiento de la plataforma morar.ok podremos recopilar y almacenar información proporcionada directamente por el usuario, incluyendo:</p>
          <ul className="list-disc pl-5 space-y-3 mt-2 text-slate-600">
            <li>Nombre y apellidos, y número de documento de identidad del evaluador.</li>
            <li>Información necesaria para la autenticación y gestión de la sesión.</li>
            <li><strong>Coordenadas de geolocalización (GPS)</strong> de la edificación inspeccionada.</li>
            <li><strong>Fotografías capturadas</strong> durante el proceso de inspección técnica (fachada y daños estructurales).</li>
            <li><strong>Datos técnicos de la edificación:</strong> información detallada sobre el sistema constructivo, nivel de daño y elementos no estructurales.</li>
            <li>Datos de contacto de terceros (ej. propietarios o responsables de edificaciones), los cuales son suministrados por el usuario bajo su responsabilidad de haber obtenido la autorización correspondiente, y serán usados exclusivamente para el registro técnico de la inspección.</li>
            <li>Firma digitalizada o electrónica del usuario (si aplica).</li>
          </ul>
          <p className="mt-4 text-slate-600">No se solicitarán datos personales que no sean necesarios para las finalidades descritas en esta política.</p>

          <h3 className="text-lg font-bold text-slate-900 mt-8 mb-3">3. Finalidades del tratamiento</h3>
          <p className="text-slate-600">Los datos personales serán tratados con las siguientes finalidades:</p>
          <ol className="list-decimal pl-5 space-y-3 mt-2 text-slate-600">
            <li>Crear y administrar la sesión local del usuario inspector.</li>
            <li>Generar un informe técnico consolidado (Dictamen de Habitabilidad en formato PDF) sobre el nivel de riesgo post-sismo.</li>
            <li>Asociar la información recolectada en campo con el inspector responsable.</li>
            <li>Mantener, mejorar y garantizar el correcto funcionamiento de la plataforma.</li>
            <li>Cumplir con las obligaciones legales que resulten aplicables.</li>
          </ol>
          <p className="mt-4 text-slate-600">Los datos personales no serán utilizados para finalidades diferentes a las informadas al titular, salvo que exista una autorización adicional o una obligación legal que lo permita.</p>

          <h3 className="text-lg font-bold text-slate-900 mt-8 mb-3">4. Tratamiento y almacenamiento de la información</h3>
          <p className="text-slate-600">La información proporcionada por los usuarios podrá ser almacenada en bases de datos y servicios tecnológicos utilizados para la operación de la plataforma.</p>
          <p className="text-slate-600">El nombre y demás datos asociados a la cuenta podrán permanecer almacenados mientras la cuenta se encuentre activa o durante el tiempo necesario para cumplir las finalidades descritas en esta política. Actualmente, la herramienta opera generando un almacenamiento primario en el dispositivo (Local Storage).</p>
          <p className="text-slate-600">La información podrá ser almacenada en servidores ubicados fuera del territorio colombiano a través de proveedores de servicios en la nube que cumplen con estándares internacionales de seguridad, lo cual el titular acepta y autoriza en caso de futuras sincronizaciones en línea.</p>

          <h3 className="text-lg font-bold text-slate-900 mt-8 mb-3">5. Seguridad de la información</h3>
          <p className="text-slate-600">Se implementarán medidas técnicas, administrativas y organizativas razonables para proteger los datos personales y documentos almacenados frente a pérdida, alteración, acceso no autorizado, divulgación o uso indebido.</p>
          <p className="text-slate-600">El acceso a la información estará limitado de acuerdo con los roles y permisos establecidos dentro de la plataforma.</p>

          <h3 className="text-lg font-bold text-slate-900 mt-8 mb-3">6. Confidencialidad</h3>
          <p className="text-slate-600">Las personas que intervengan en el tratamiento de los datos personales deberán mantener la confidencialidad de la información a la que tengan acceso y utilizarla únicamente para las finalidades autorizadas.</p>

          <h3 className="text-lg font-bold text-slate-900 mt-8 mb-3">7. Documentos e Imágenes cargadas por los usuarios</h3>
          <p className="text-slate-600">Las fotografías y evidencias cargadas voluntariamente por los usuarios serán tratadas únicamente para el sustento técnico de la evaluación estructural.</p>
          <p className="text-slate-600">El usuario será responsable de garantizar que cuenta con los derechos, permisos o autorizaciones necesarios para tomar y almacenar fotografías de los inmuebles privados inspeccionados.</p>

          <h3 className="text-lg font-bold text-slate-900 mt-8 mb-3">8. Derechos de los titulares</h3>
          <p className="text-slate-600">De acuerdo con la legislación colombiana, los titulares de los datos personales tienen derecho a:</p>
          <ul className="list-disc pl-5 space-y-3 mt-2 text-slate-600">
            <li>Conocer los datos personales que son objeto de tratamiento.</li>
            <li>Solicitar la actualización y rectificación de sus datos.</li>
            <li>Solicitar la supresión de sus datos cuando sea procedente.</li>
            <li>Presentar quejas ante la Superintendencia de Industria y Comercio cuando considere que se han vulnerado sus derechos.</li>
          </ul>
          <p className="mt-4 text-slate-600">Estos derechos se encuentran contemplados, entre otras disposiciones, en la Ley 1581 de 2012.</p>

          <h3 className="text-lg font-bold text-slate-900 mt-8 mb-3">9. Consultas y reclamos</h3>
          <p className="text-slate-600">El titular podrá realizar consultas o presentar reclamos relacionados con sus datos personales mediante el siguiente canal:</p>
          <p className="font-semibold text-slate-800">Correo electrónico: <span className="font-normal text-slate-600">coordinacion@controller.com.co</span></p>

          <h3 className="text-lg font-bold text-slate-900 mt-8 mb-3">10. Conservación de los datos</h3>
          <p className="text-slate-600">Los datos personales y documentos serán conservados durante el tiempo necesario para cumplir las finalidades para las cuales fueron recopilados, o cuando exista una obligación legal que requiera su conservación.</p>
        </div>
        
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
