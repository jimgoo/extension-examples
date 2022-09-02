// import * as React from 'react';
// import { Panel } from '@lumino/widgets';
// import { ReactWidget } from '@jupyterlab/apputils';
// import { Notebook, BaseResponse, defaultBackendUser } from './types';
// //import { useAuth } from './useAuth';
// import { apiKey, backendURL } from './config';

// const USER_KEY = 'jupyterspot-user'

// function onSuccess(res: BaseResponse) {
//   console.info(res.msg);
// }

// function onFailure(res: BaseResponse) {
//   console.info(res.msg);
// }

// function onError(msg: string) {
//   console.info(msg);
// }

// function getUserFromLocalStorage() {
//   const user = localStorage.getItem(USER_KEY)
//   return user ? JSON.parse(user) : null
// }

// function authHeader() {
//   const headers = {"Authorization": "Bearer " + getUserFromLocalStorage()};
//   return headers;
// }

// function jwt_decode(token: string) {
//   var base64Url = token.split('.')[1];
//   var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//   var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
//       return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//   }).join(''));

//   return JSON.parse(jsonPayload);
// };

// function decodeUser(user: any) {
//   const userDec = user ? (jwt_decode(user) as JSON) : null

//   console.info("decoded", userDec);

//   if (userDec && 'sub' in userDec) {
//     //@ts-ignore
//     const backendUser = userDec['sub'] as BackendUser
//     backendUser.loggedIn = true
//     return backendUser
//   }
//   return defaultBackendUser
// }

// export class JupyterSpotPanel extends Panel {
//   private _body: JupyterSpotBody;

//   constructor(
//   ) {
//     super({});
//     this._body = new JupyterSpotBody();
//     this.addWidget(this._body);
//     this.update();

//     // const { login } = useAuth();
//     this._login();
//     this._convertNotebook();
//   }

//   private _login = async () => {

//     // await login(onSuccess, onFailure, onError, apiKey);
//     const apiUrl = backendURL + '/api/v1/login-api'
//     const formData = new FormData()
//     formData.append('apiKey', apiKey)

//     await fetch(apiUrl, {
//       method: 'post',
//       body: formData,
//     })
//     .then((res) => res.json())
//     .then((res) => {
//       if (res.success) {
//         // setUserFromToken(res.token)
//         const user = JSON.stringify(res.token)
//         localStorage.setItem(USER_KEY, user)
//         onSuccess(res)
//       } else {
//         onFailure(res)
//       }
//       return res
//     })
//     .catch((err) => {
//       onError('Error calling API: ' + apiUrl)
//     })
//   }

//   private _convertNotebook = async () => {
//     authHeader();
//     window.alert(decodeUser(getUserFromLocalStorage()))
//   }
// }

// export class JupyterSpotBody extends ReactWidget {
//   private _loading: boolean;
//   private _notebooks: Notebook[] = [];

//   constructor() {
//     super();
//     this._loading = false;
//   }

//   get getLoading(): boolean {
//     return this._loading;
//   }

//   render(): React.ReactElement<any>[] {
//     return this._notebooks.map((notebook, i) => {

//       const onClick = () => {
//       };

//       return (
//         <div
//           key={i}
//         >
//           <div
//             style={{  }}
//             onClick={onClick}
//           >
//             <span>{notebook.name}</span>
//           </div>
//         </div>
//       );
//     });
//   }
//   // render(): React.ReactElement<any>[] {
//   //  return (
//   //   <div>
//   //     test
//   //   </div>
//   //  )
//   // }
// }
