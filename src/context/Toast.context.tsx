import React, { FC, RefObject, ReactNode, useState } from "react";
import { ToastProps, positionClasses } from "../components/Toast/utils";
import Toast from "../components/Toast/Toast.component";

export type ToastContextType = {
  add: (toast: Omit<ToastProps, "id">) => void;
  remove: (toastId: number, ref: RefObject<HTMLDivElement>) => void;
};

const ToastContext = React.createContext({} as ToastContextType);

export const useToast = () => React.useContext(ToastContext);

export const ToastProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const add = (toast: Omit<ToastProps, "id">) => {
    setToasts((prevToasts) => [...prevToasts, { ...toast, id: Math.random() * 1000 }]);
  };

  const remove = (toastId: number, ref: RefObject<HTMLDivElement>) => {
    ref.current?.classList.add("animate-toastOut");
    ref.current?.addEventListener("animationend", () => {
      //remove it when animation ends
      setToasts((toasts) => toasts.filter((toast) => toast.id !== toastId));
    });
  };

  return (
    <ToastContext.Provider value={{ add, remove }}>
      {children}
      <div className={`${positionClasses["bottomRight"]} fixed w-screen max-w-xs z-50`}>
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
