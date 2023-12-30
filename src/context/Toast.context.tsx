import React, { FC, ReactNode, RefObject, useState } from 'react';
import { positionClasses, ToastProps } from '../components/Toast/types.tsx';
import Toast from '../components/Toast/Toast.component';

export type ToastContextType = {
  showAlertMessage: (toast: Omit<ToastProps, 'id'>) => void;
  removeAlertMessage: (toastId: number, ref: RefObject<HTMLDivElement>) => void;
};

const ToastContext = React.createContext({} as ToastContextType);

export const useToast = () => React.useContext(ToastContext);

export const ToastProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const showAlertMessage = (toast: Omit<ToastProps, 'id'>) => {
    setToasts((prevToasts) => [
      ...prevToasts,
      { ...toast, id: Math.random() * 1000 },
    ]);
  };

  const removeAlertMessage = (
    toastId: number,
    ref: RefObject<HTMLDivElement>,
  ) => {
    ref.current?.classList.add('animate-toastOut');
    ref.current?.addEventListener('animationend', () => {
      //remove it when animation ends
      setToasts((toasts) => toasts.filter((toast) => toast.id !== toastId));
    });
  };

  return (
    <ToastContext.Provider value={{ showAlertMessage, removeAlertMessage }}>
      {children}
      <div
        className={`${positionClasses['bottomRight']} fixed w-screen max-w-xs z-50`}
      >
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
