// // Copyright (c) Jupyter Development Team.
// // Distributed under the terms of the Modified BSD License.

// import * as React from 'react';

// import { Awareness } from 'y-protocols/awareness';

// import { Panel } from '@lumino/widgets';

// import { ReactWidget } from '@jupyterlab/apputils';

// //import { ICurrentUser } from '@jupyterlab/collaboration';
// import { PathExt } from '@jupyterlab/coreutils';
// import { CellTypeSwitcher } from '@jupyterlab/notebook';

// export class JupyterSpotPanel extends Panel {
//   private _body: JupyterSpotBody;
// //   private _layoutRestorer: (layout: ICollaboratorLayout) => void;

//   constructor(
//     awareness: Awareness,
//     fileopener: (path: string) => void,
//   ) {
//     super({});
//     this._body = new JupyterSpotBody(fileopener);
//     this.addWidget(this._body);
//     this.update();
//   }
// }

// /**
//  * The collaborators list.
//  */
// export class JupyterSpotBody extends ReactWidget {
//   private _fileopener: (path: string) => void;
//   private _loading: boolean;

//   constructor(fileopener: (path: string) => void) {
//     super();
//     this._fileopener = fileopener;
//     this._loading = false;
//   }

//   get getLoading(): boolean {
//     return this._loading;
//   }

//   set followingUser(loading: boolean) {
//     this._loading = loading;
//     this.update();
//   }

//   render(): React.ReactElement<any>[] {
//       return (
//         <div>
//           {this._loading ? "loading" : "done"}
//         </div>
//       );
//   }
// }
