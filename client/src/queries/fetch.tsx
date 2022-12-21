import axios, { AxiosResponse } from 'axios';
import createToast from '../Components/createToast';

const development =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

const devURL = 'http://localhost:3002';
const prodURL = 'http://se2-c.compute.dtu.dk:3002';

const getPath = (p: string) => (development ? devURL : prodURL) + p;

export async function asyncPost<T>(
  path: string,
  obj: object,
): Promise<AxiosResponse<T, any>> {
  const request = axios.get<T>(getPath(path), {
    params: obj,
    paramsSerializer: (params) =>
      Object.keys(params)
        .map((key: any) => new URLSearchParams(`${key}=${params[key]}`))
        .join('&'),
  });
  request.catch(() => createToast({ title: `Connection to server failed` }));
  return request;
}

/** @author Benjamin Lumbye s204428 */
export async function realAsyncPost<T>(
  path: string,
  data: any,
): Promise<AxiosResponse<T, any>> {
  const request = axios.post<T>(getPath(path), data);
  request.catch(() => createToast({ title: `Connection to server failed` }));
  return request;
}

export function get<T>(path: string, callback: (data: T) => void): void {
  fetch(getPath(path))
    .then((res) => res.json())
    .then((data) => callback(data))
    .catch(() => createToast({ title: `Connection to server failed` }));
}

export function post<T>(
  path: string,
  obj: object,
  callback: (data: T) => void,
): void {
  asyncPost<T>(path, obj).then((res) => callback(res.data));
}

export const put = (path: string, obj: object): void => {
  axios
    .put(getPath(path), { params: obj })
    .catch(() => createToast({ title: `Connection to server failed` }));
};

export const _delete = (path: string): void => {
  axios
    .delete(getPath(path))
    .catch(() => createToast({ title: `Connection to server failed` }));
};
