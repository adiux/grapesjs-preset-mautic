import Logger from './logger';
import loadComponents from './components';
import loadCommands from './commands';
import loadButtons from './buttons';
import loadEvents from './events';
import loadBlocks from './blocks';
import { Editor  } from 'grapesjs';

export default (editor: Editor, opts = {}) => {
  const am = editor.AssetManager;

  const config = {
    showLayersManager: 0,
    showImportButton: 0,
    // logFilter: 'log:debug',
    logFilter: 'log:info',
    ...opts,
  };

  const logger = new Logger(editor);
  logger.addListener(config.logFilter);

  // Extend the original `image` and add a confirm dialog before removing it
  am.addType('image', {
    // As you adding on top of an already defined type you can avoid indicating
    // `am.getType('image').view.extend({...` the editor will do it by default
    // but you can eventually extend some other type
    view: {
      // If you want to see more methods to extend check out
      // https://github.com/artf/grapesjs/blob/dev/src/asset_manager/view/AssetImageView.js
      onRemove(e: Event) {
        e.stopImmediatePropagation();

        // eslint-disable-next-line no-alert, no-restricted-globals
        // @ts-ignore
        if (confirm(Mautic.translate('grapesjsbuilder.deleteAssetConfirmText'))) {
          // @ts-ignore
          this.model.collection.remove(this.model);
        }
      },
    },
  });

  // Load other parts
  loadCommands(editor);
  loadComponents(editor);
  loadEvents(editor);
  loadButtons(editor, config);
  loadBlocks(editor, config);
};
