import Swal from 'sweetalert2';

export const Toast = Swal.mixin({
  toast: true,
  position: 'bottom-center',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  customClass: {
    popup: 'rounded-xl shadow-lg border border-slate-100 font-sans',
    title: 'text-sm font-bold text-slate-700 font-sans',
  }
});

export const ConfirmModal = Swal.mixin({
  customClass: {
    popup: 'rounded-2xl shadow-2xl border-0 font-sans',
    title: 'text-xl font-bold text-slate-800 font-sans',
    htmlContainer: 'text-slate-600 font-sans',
    confirmButton: 'bg-primary hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-xl mx-2 transition-colors focus:ring-4 focus:ring-blue-300 outline-none',
    cancelButton: 'bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-6 rounded-xl mx-2 transition-colors outline-none'
  },
  buttonsStyling: false
});

export const DangerConfirmModal = Swal.mixin({
  customClass: {
    popup: 'rounded-2xl shadow-2xl border-0 font-sans',
    title: 'text-xl font-bold text-slate-800 font-sans',
    htmlContainer: 'text-slate-600 font-sans',
    confirmButton: 'bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-xl mx-2 transition-colors focus:ring-4 focus:ring-red-300 outline-none',
    cancelButton: 'bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-6 rounded-xl mx-2 transition-colors outline-none'
  },
  buttonsStyling: false
});
