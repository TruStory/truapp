import { toast } from 'react-toastify';
import { toastOptions } from 'shared/utils/toast';

export const truToast = (message: string) => {
  toast(message, toastOptions);
};

export const truToastError = (message: string) => {
  toast.error(message, toastOptions);
};

export const truToastSuccess = (message: string) => {
  toast.success(message, toastOptions);
};
