import { useAuthUser } from 'react-auth-kit';
import { ApiError } from '../models/ApiError';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../routes/common.routes';
import { useToast } from '../context/Toast.context';

export default function useFetch() {
  const navigate = useNavigate();
  const auth = useAuthUser();
  const { showAlertMessage } = useToast();

  async function fetchData<T>(
    url: string,
    method: RequestInit['method'],
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
    });

    if (response.status === 401) navigate(ROUTES.Login, { replace: true });

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
