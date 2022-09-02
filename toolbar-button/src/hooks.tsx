import * as React from 'react';
import { Notebook, BaseResponse } from './types';
import { backendURL } from './config';
import { useAuth } from './useAuth';

export interface ConvertResponse {
  success: boolean;
  msg: string;
  id: string;
}

export interface ListResponse {
  success: boolean;
  msg: string;
  notebooks: Notebook[];
}

export function useNotebook() {
  const [notebook, setNotebook] = React.useState<any>();

  const { authHeader } = useAuth();

  const convertByJSON = React.useCallback(
    async (
      onSuccess: (res: ConvertResponse) => void,
      onFailure: (res: BaseResponse) => void,
      onError: (msg: string) => void,
      nb_json: string,
      path: string
    ) => {
      // store the notebook on the backend
      const apiUrl = backendURL + '/api/v1/convert-nb-from-json-ext';
      const formData = new FormData();
      formData.append('nb_json', nb_json);
      formData.append('nb_path', path);

      const apiCall = await fetch(apiUrl, {
        method: 'post',
        body: formData,
        headers: authHeader(),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.success) {
            onSuccess(res);
          } else {
            onFailure(res);
          }
          return res;
        })
        .catch((err) => {
          onError('Error calling API: ' + apiUrl);
        });
      return apiCall;
    },
    []
  );

  const listNotebooks = React.useCallback(
    async (
      onSuccess: (res: ListResponse) => void,
      onFailure: (res: ListResponse) => void,
      onError: (msg: string) => void,
      email: string
    ) => {
      // store the notebook on the backend
      const apiUrl = backendURL + '/api/v1/list-notebooks';
      const formData = new FormData();
      formData.append('email', email);

      const apiCall = await fetch(apiUrl, {
        method: 'post',
        body: formData,
        headers: authHeader(),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.success) {
            onSuccess(res);
          } else {
            onFailure(res);
          }
          return res;
        })
        .catch((err) => {
          onError('Error calling API: ' + apiUrl);
        });
      return apiCall;
    },
    []
  );

  return {
    notebook,
    setNotebook,
    convertByJSON,
    listNotebooks,
  };
}
