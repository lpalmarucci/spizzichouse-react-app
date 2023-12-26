import { useEffect, useRef } from 'react';
import {
  closeButtonClasses,
  closeIcon,
  ToastProps,
  wrapperClasses,
} from './utils';
import { useToast } from '../../context/Toast.context';

const Toast = (props: ToastProps) => {
  const {
    id,
    type = 'info',
    // icon = '',
    message = '---',
    duration = 5000,
  } = props;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const { removeAlertMessage } = useToast();

  //auto dismiss
  const dismissRef = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    dismissRef.current = setTimeout(() => {
      removeAlertMessage(id, wrapperRef);
    }, duration);
  });

  return (
    <div
      role="alert"
      ref={wrapperRef}
      className={`flex justify-between items-center overflow-hidden rounded-md shadow-lg my-3 ${wrapperClasses[type]} animate-toastIn`}
    >
      <div className="text-sm font-semibold flex-grow p-3">{message}</div>

      <button
        className={closeButtonClasses}
        aria-label="close"
        onClick={() => removeAlertMessage(id, wrapperRef)}
      >
        <span className="sr-only">Close</span>
        {closeIcon}
      </button>
    </div>
  );
};

export default Toast;
