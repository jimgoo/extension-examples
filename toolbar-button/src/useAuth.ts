// import jwt_decode from 'jwt-decode'
import * as React from 'react';
import { backendURL } from './config';
import { BackendUser, defaultBackendUser, BaseResponse } from './types';

const USER_KEY = 'jupyterspot-user';

export function useAuth() {
  function getUserFromLocalStorage() {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  function getToken() {
    return getUserFromLocalStorage();
  }

  function authHeader() {
    const headers = { Authorization: 'Bearer ' + getToken() };
    return headers;
  }

  function jwt_decode(token: string) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  }

  function decodeUser(user: any) {
    const userDec = user ? (jwt_decode(user) as JSON) : null;

    console.info('decoded', userDec);

    if (userDec && 'sub' in userDec) {
      //@ts-ignore
      const backendUser = userDec['sub'] as BackendUser;
      backendUser.loggedIn = true;
      return backendUser;
    }
    return defaultBackendUser;
  }

  const [currentUser, setCurrentUser] = React.useState(
    decodeUser(getUserFromLocalStorage())
  );

  const setUserFromToken = React.useCallback(
    (token: any) => {
      const user = JSON.stringify(token);
      localStorage.setItem(USER_KEY, user);
      setCurrentUser(decodeUser(user));
    },
    [setCurrentUser]
  );

  function getCurrentUser() {
    //console.info("---> getCurrentUser", decodeUser(getUser()));
    //console.info("---> getCurrentUser", getUser());
    return getUserFromLocalStorage();
  }

  const logout = React.useCallback(() => {
    localStorage.removeItem(USER_KEY);
    setCurrentUser(defaultBackendUser);
  }, [setCurrentUser]);

  const login = React.useCallback(
    async (
      onSuccess: (res: BaseResponse) => void,
      onFailure: (res: BaseResponse) => void,
      onError: (msg: string) => void,
      apiKey: string
    ) => {
      const apiUrl = backendURL + '/api/v1/login-api';

      const formData = new FormData();
      formData.append('apiKey', apiKey);

      const apiCall = await fetch(apiUrl, {
        method: 'post',
        body: formData,
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.success) {
            setUserFromToken(res.token);
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
    [setUserFromToken]
  );

  const fetchUser = React.useCallback(
    async (
      onSuccess: (res: BaseResponse) => void,
      onFailure: (res: BaseResponse) => void,
      onError: (msg: string) => void,
      email: string
    ) => {
      const apiUrl = backendURL + '/api/v1/fetch-user';

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
            setUserFromToken(res.token);
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
    [setUserFromToken]
  );

  return {
    currentUser,
    setCurrentUser,
    setUserFromToken,
    getCurrentUser,
    authHeader,
    login,
    logout,
    fetchUser,
  };
}
