import { IDisposable, DisposableDelegate } from '@lumino/disposable';
import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from '@jupyterlab/application';
import { ToolbarButton } from '@jupyterlab/apputils';
import { DocumentRegistry } from '@jupyterlab/docregistry';
import {
  // NotebookActions,
  NotebookPanel,
  INotebookModel,
} from '@jupyterlab/notebook';
import { PageConfig } from '@jupyterlab/coreutils';
import { apiKey, backendURL, frontendURL } from './config';
//import { JupyterSpotPanel } from './panel';
//import React from 'react';
import { showErrorMessage } from '@jupyterlab/apputils';

//import { ICommandPalette } from '@jupyterlab/apputils';

/**
 * A notebook widget extension that adds a button to the toolbar.
 */
export class ButtonExtension
  implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel> {
  /**
   * Create a new extension for the notebook panel widget.
   *
   * @param panel Notebook panel
   * @param context Notebook context
   * @returns Disposable on the added button
   */
  createNew(
    panel: NotebookPanel,
    context: DocumentRegistry.IContext<INotebookModel>
  ): IDisposable {
    const button = new ToolbarButton({
      className: 'upload-button',
      label: 'Open in JupyterSpot',
      tooltip: 'Open in JupyterSpot',
      pressedTooltip: 'Adding notebook to JupyterSpot',
      disabledTooltip: 'Adding notebook to JupyterSpot...',
      enabled: true,
      pressed: false,
      // label: loading ? 'Loading' : 'Open in JupyterSpot',
      // tooltip: loading ? 'Loading' : 'Open in JupyterSpot',
      onClick: async (): Promise<void> => {
        const nb_json = JSON.stringify(panel.content.model.toJSON(), null);

        // get notebook path
        // TODO: use a path helper to handle Windows paths
        const nb_path =
          PageConfig.getOption('serverRoot') + '/' + panel.context.localPath;

        const requestUrl = backendURL + '/api/v1/convert-nb-from-json-ext';
        console.info('requestUrl:', requestUrl);
        const fd = new FormData();
        fd.append('nb_json', nb_json);
        fd.append('nb_path', nb_path);
        fd.append('api_key', apiKey);

        await fetch(requestUrl, {
          method: 'post',
          body: fd,
        })
          // the JSON body is taken from the response
          .then((res) => res.json())
          .then((res) => {
            console.log('res:', res);
            if (res.success) {
              const url = frontendURL + '/notebook/' + res.id;
              window.open(url);
              showErrorMessage(
                'Added notebook to JupyterSpot',
                "If a new tab didn't open, " +
                  "give your browser permission to open popups from JupyterLab. The notebook's URL for sharing is: " +
                  url
              );
              console.info('JupyterSpot notebook url: ', url);
            } else {
              showErrorMessage('Error adding notebook to JupyterSpot', res.msg);
            }
            return res;
          })
          .catch((error) => {
            console.log('error:', error);
            showErrorMessage(
              'Error adding the notebook to JupyterSpot.',
              error.toString()
            );
            return error;
          });
      },
    });

    panel.toolbar.insertItem(10, 'openInJupyterSpot', button);
    return new DisposableDelegate(() => {
      button.dispose();
    });
  }
}

/**
 * The plugin registration information.
 */
const buttonPlugin: JupyterFrontEndPlugin<void> = {
  id: '@jupyterspot/jupyterspot-extension:button',
  autoStart: true,
  // requires: [ISplashScreen],
  activate: (
    app: JupyterFrontEnd
    // splash: ISplashScreen,
  ): void => {
    console.info('----> Activing JupyterSpot extension');
    // splash.show();
    app.docRegistry.addWidgetExtension('Notebook', new ButtonExtension());
  },
};

/**
 * Activate the extension.
 *
 * @param app Main application object
 */
// function activate(app: JupyterFrontEnd): void {
//   app.docRegistry.addWidgetExtension('Notebook', new ButtonExtension());
//   console.log('activating the JupyterLab main application:', app);
// }

// const panelPlugin: JupyterFrontEndPlugin<void> = {
//   id: '@jupyterspot/jupyterspot-extension:panel',
//   autoStart: true,
//   requires: [],
//   activate: (
//     app: JupyterFrontEnd,
//   ): void => {

//     const panel = new JupyterSpotPanel();
//     panel.id = DOMUtils.createDomID();
//     // panel.title.icon = usersIcon;
//     // panel.addClass('jp-RTCPanel');
//     app.shell.add(panel, 'left', { rank: 300 });
//   }
// };

/**
 * Export the plugin as default.
 */
// export default panelPlugin;
const plugins: JupyterFrontEndPlugin<any>[] = [
  buttonPlugin,
  // panelPlugin,
];

export default plugins;

// /**
//  * Initialization data for the command palette example.
//  */
//  const extension: JupyterFrontEndPlugin<void> = {
//   id: 'command-palette',
//   autoStart: true,
//   requires: [ICommandPalette],
//   activate: (app: JupyterFrontEnd, palette: ICommandPalette) => {
//     const { commands } = app;

//     const command = 'jlab-examples:command-palette';

//     // Add a command
//     commands.addCommand(command, {
//       label: 'Execute jlab-examples:command-palette Command',
//       caption: 'Execute jlab-examples:command-palette Command',
//       execute: (args: any) => {
//         console.log(
//           `jlab-examples:command-palette has been called ${args['origin']}.`
//         );
//       },
//     });

//     // Add the command to the command palette
//     const category = 'Extension Examples';
//     palette.addItem({ command, category, args: { origin: 'from palette' } });
//   },
// };

// export default extension;

// const plugins: JupyterFrontEndPlugin<any>[] = [
//   userPlugin,
//   userMenuPlugin,
//   menuBarPlugin,
//   rtcGlobalAwarenessPlugin,
//   rtcPanelPlugin
// ];
