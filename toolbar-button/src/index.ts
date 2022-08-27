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

// import { ICommandPalette } from '@jupyterlab/apputils';

// <TODO>
const FRONTEND_URL = 'http://localhost:5420';
const API_URL = 'http://127.0.0.1:5005';
const API_KEY = 'bjIFlcaViwUNS0HHSnYkTBjMaC3qNKBmMzF__nlgQ_0';

/**
 * The plugin registration information.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  activate,
  id: 'jupyterspot',
  autoStart: true,
};

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
    async function getData(): Promise<any> {
      // TODO: save before uploading so that localPath points to most recent version
      const requestUrl = API_URL + '/api/v1/store-nb-from-json-ext';
      console.info('requestUrl:', requestUrl);

      // console.info("panel.content:", panel.content);
      // console.info("panel.context:", panel.context);
      // console.info("panel.context.localPath", panel.context.localPath);
      // console.info(panel.context.listCheckpoints());
      // console.info(PageConfig.getOption('serverRoot'));
      // console.info(panel.context.contentsModel.path);
      // console.info("context:", context);

      // get notebook as a JSON string
      // TOODO: match format of original notebook (keys are out of order from original)
      const nb_json = JSON.stringify(panel.content.model.toJSON(), null);
      // console.info("nb_json:", nb_json);

      // get notebook path
      // TODO: use a path helper to handle Windows paths
      const nb_path =
        PageConfig.getOption('serverRoot') + '/' + panel.context.localPath;
      console.info('nb_path:', nb_path);

      const fd = new FormData();
      fd.append('nb_json', nb_json);
      fd.append('nb_path', nb_path);
      fd.append('api_key', API_KEY);

      return (
        fetch(requestUrl, {
          method: 'post',
          body: fd,
        })
          // the JSON body is taken from the response
          .then((res) => res.json())
          .then((res) => {
            console.log('res:', res);
            if (res.success) {
              const url = FRONTEND_URL + '/notebook/' + res.id;
              console.info('jspot url', url);
              window.open(url);
            }
            return res;
          })
          .catch((error) => {
            console.log('error:', error);
            return error;
          })
      );
    }

    const button = new ToolbarButton({
      className: 'upload-button',
      label: 'Open in JupyterSpot',
      tooltip: 'Open in JupyterSpot',
      onClick: getData,
    });

    panel.toolbar.insertItem(10, 'uploadNotebook', button);
    return new DisposableDelegate(() => {
      button.dispose();
    });
  }
}
/**
 * Activate the extension.
 *
 * @param app Main application object
 */
function activate(app: JupyterFrontEnd): void {
  app.docRegistry.addWidgetExtension('Notebook', new ButtonExtension());
  console.log('activating the JupyterLab main application:', app);
}

/**
 * Export the plugin as default.
 */
export default plugin;

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
