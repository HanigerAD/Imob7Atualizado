import { toast, Id, UpdateOptions, ToastOptions } from 'react-toastify'

const TOAST_OPTIONS_DEFAULT = {
  style: { whiteSpace: 'pre-line' }, isLoading: false, closeButton: true, closeOnClick: true
} as UpdateOptions;

export class ToastHelper {
  toastLoadingId: Id | undefined

  constructor() {
  }

  loading(conteudo: string) {
    this.toastLoadingId = toast.loading(conteudo);
  }

  success(conteudo: string) {
    if (this.toastLoadingId) {
      toast.update(this.toastLoadingId, { ...TOAST_OPTIONS_DEFAULT, render: conteudo, type: 'success', autoClose: 5000 });
      this.toastLoadingId = undefined;
    } else {
      toast.success(conteudo);
    }
  }

  error(conteudo: string) {
    if (this.toastLoadingId) {
      toast.update(this.toastLoadingId, { ...TOAST_OPTIONS_DEFAULT, render: conteudo, type: 'error', autoClose: false });
      this.toastLoadingId = undefined;
    } else {
      toast.error(conteudo, { ...TOAST_OPTIONS_DEFAULT, autoClose: false } as ToastOptions);
    }
  }

  warning(conteudo: string) {
    if (this.toastLoadingId) {
      toast.update(this.toastLoadingId, { ...TOAST_OPTIONS_DEFAULT, render: conteudo, type: 'warning' });
      this.toastLoadingId = undefined;
    } else {
      toast.warning(conteudo);
    }
  }

  info(conteudo: string) {
    if (this.toastLoadingId) {
      toast.update(this.toastLoadingId, { ...TOAST_OPTIONS_DEFAULT, render: conteudo, type: 'info' });
      this.toastLoadingId = undefined;
    } else {
      toast.info(conteudo);
    }
  }
}