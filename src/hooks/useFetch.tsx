import { useAuthUser } from 'react-auth-kit';
import { ApiError } from '../models/ApiError';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../routes/common.routes';
import { useToast } from '../context/Toast.context';
import { useEffect, useRef } from 'react';

const redirectResponseWithStatus = [401, 403];

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export default function useFetch() {
  const navigate = useNavigate();
  const auth = useAuthUser();
  const { showAlertMessage } = useToast();
  const location = useLocation();
  const abortController = useRef<AbortController>(new AbortController());

  useEffect(() => {
    return () => abortController.current.abort();
  }, []);

  async function fetchData<T>(
    url: string,
    method: HttpMethod,
    options?: RequestInit,
    withAuthorization: boolean = true,
  ): Promise<T> {
    const headers: HeadersInit = new Headers({
      'Content-Type': 'application/json',
      ...options?.headers,
    });
    if (withAuthorization) {
      headers.set('Authorization', 'Bearer ' + auth()?.access_token);
    }
    const response = await fetch(import.meta.env.VITE_SERVER_URL + url, {
      ...options,
      method,
      headers,
      signal: abortController.current.signal,
    });

    if (redirectResponseWithStatus.includes(response.status)) {
      showAlertMessage({ message: 'Non autorizzato', type: 'error' });
      localStorage.clear();
      navigate(ROUTES.Login, { replace: true, state: { from: location } });
    }

    if (response.status === 204) return Promise.resolve({} as T);
    const data = (await response.json()) as T | ApiError;

    if (isResponseError(data)) {
      showAlertMessage({ message: data.message, type: 'error' });
      return Promise.reject(data as ApiError);
    }

    return Promise.resolve(data);
  }

  return fetchData;
}

function isResponseError(obj: any): obj is ApiError {
  return ![200, 201].includes(obj.statusCode) && obj.message;
}
