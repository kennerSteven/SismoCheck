const fs = require('fs');
const file = 'src/components/steps/FisurasForm.jsx';
let content = fs.readFileSync(file, 'utf8');

const target =             {fisurasList.map((f, index) => (
              <div key={index} className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex gap-3 sm:gap-4 items-start shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300">
                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-extrabold text-sm sm:text-base border border-blue-100">
                  {index + 1}
                </div>
                <div className="flex-1 pt-0.5">
                  <h4 className="font-extrabold text-slate-800 text-sm sm:text-base mb-2">
                    {elementoOptions.find(o => o.id === f.elemento)?.label || f.elemento}
                  </h4>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    <span className="inline-flex items-center px-2 py-1 bg-slate-50 border border-slate-200 text-slate-600 text-[10px] sm:text-xs font-semibold rounded-md">
                      {getLabel(tipoOptions, f.tipo)}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 bg-slate-50 border border-slate-200 text-slate-600 text-[10px] sm:text-xs font-semibold rounded-md">
                      {getLabel(TAMANO_OPTIONS, f.tamano)}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 bg-slate-50 border border-slate-200 text-slate-600 text-[10px] sm:text-xs font-semibold rounded-md">
                      {getLabel(EVOLUCION_OPTIONS, f.evolucion)}
                    </span>
                  </div>
                </div>
                
                {f.fotoUrl && (
                  <div className="flex-shrink-0 ml-2">
                    <img src={f.fotoUrl} alt="Foto daño" className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-slate-200 shadow-sm" />
                  </div>
                )}
                
                <button
                  type="button"
                  onClick={() => removeFisura(index)}
                  className="flex-shrink-0 ml-1 text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                  title="Eliminar registro"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            ))};

const replacement =             {fisurasList.map((f, index) => (
              <div key={index} className="bg-[#f6ebd7] border border-[#d8ccb8] border-l-[6px] border-l-[#d27521] p-2.5 px-4 flex justify-between items-center transition-all duration-300 mb-2">
                <div className="text-[#13436a] text-xs sm:text-[13px] leading-tight flex-1">
                  #{index + 1} {elementoOptions.find(o => o.id === f.elemento)?.label || f.elemento} — {getLabel(tipoOptions, f.tipo)} — {getLabel(TAMANO_OPTIONS, f.tamano)} — {getLabel(EVOLUCION_OPTIONS, f.evolucion)}
                  {f.aceros ? \ — \: \\ : ''}
                  {f.corrosion ? \ (corrosión: \)\ : ''}
                </div>
                
                <div className="flex gap-3 items-center flex-shrink-0 ml-3">
                  {f.fotoUrl && (
                    <img src={f.fotoUrl} alt="Foto daño" className="w-8 h-8 object-cover border border-[#d8ccb8]" />
                  )}
                  <button
                    type="button"
                    onClick={() => removeFisura(index)}
                    className="w-7 h-7 flex items-center justify-center border border-[#788ca0] text-[#13436a] bg-transparent hover:bg-white transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))};

if(content.includes(target)) {
  fs.writeFileSync(file, content.replace(target, replacement));
  console.log("Success");
} else {
  console.log("Target not found");
}
