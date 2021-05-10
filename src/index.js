import Logger from './logger';
import loadComponents from './components';
import loadCommands from './commands';
import loadButtons from './buttons';
import loadEvents from './events';
import loadBlocks from './blocks';
import loadListeners from './listeners';

export default (editor, opts = {}) => {
  const $ = mQuery;
  const am = editor.AssetManager;

  const config = {
    sourceEdit: 1,
    sourceEditBtnLabel: 'Edit',
    sourceCancelBtnLabel: 'Cancel',
    sourceEditModalTitle: 'Edit code',
    deleteAssetConfirmText: 'Are you sure?',
    showLayersManager: 0,
    showImportButton: 0,
    replaceRteWithCke: true,
    categorySectionLabel: 'Sections',
    categoryBlockLabel: 'Blocks',
    dynamicContentModalTitle: 'Edit Dynamic Content',
    dynamicContentCkeButtons: [
      'undo',
      'redo',
      'bold',
      'italic',
      'underline',
      'fontSize',
      'color',
      'align',
      'formatOL',
      'formatUL',
      'quote',
      'clearFormatting',
      'token',
      'insertLink',
      'insertImage',
      'html',
    ],
    logFilter: 'log:debug',
    ...opts,
  };

  const logger = new Logger(editor);
  logger.addListener(config.logFilter, editor);

  // Extend the original `image` and add a confirm dialog before removing it
  am.addType('image', {
    // As you adding on top of an already defined type you can avoid indicating
    // `am.getType('image').view.extend({...` the editor will do it by default
    // but you can eventually extend some other type
    view: {
      // If you want to see more methods to extend check out
      // https://github.com/artf/grapesjs/blob/dev/src/asset_manager/view/AssetImageView.js
      onRemove(e) {
        e.stopImmediatePropagation();
        const { model } = this;

        // eslint-disable-next-line no-alert, no-restricted-globals
        if (confirm(config.deleteAssetConfirmText)) {
          model.collection.remove(model);
        }
      },
    },
  });

  if (config.replaceRteWithCke && typeof $.FroalaEditor !== 'undefined') {
    // Hiding other toolbars already created
    const rteToolbar = editor.RichTextEditor.getToolbarEl();
    [].forEach.call(rteToolbar.children, (child) => {
      // eslint-disable-next-line no-param-reassign
      child.style.display = 'none';
    });

    editor.setCustomRte({
      enable(el, rte) {
        // eslint-disable-next-line no-param-reassign
        rte = $(el).froalaEditor({
          enter: $.FroalaEditor.ENTER_BR,
          pastePlain: true,

          htmlAllowedTags: [
            'a',
            'abbr',
            'address',
            'area',
            'article',
            'aside',
            'audio',
            'b',
            'base',
            'bdi',
            'bdo',
            'blockquote',
            'br',
            'button',
            'canvas',
            'caption',
            'cite',
            'code',
            'col',
            'colgroup',
            'datalist',
            'dd',
            'del',
            'details',
            'dfn',
            'dialog',
            'div',
            'dl',
            'dt',
            'em',
            'embed',
            'fieldset',
            'figcaption',
            'figure',
            'footer',
            'form',
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
            'header',
            'hgroup',
            'hr',
            'i',
            'iframe',
            'img',
            'input',
            'ins',
            'kbd',
            'keygen',
            'label',
            'legend',
            'li',
            'link',
            'main',
            'map',
            'mark',
            'menu',
            'menuitem',
            'meter',
            'nav',
            'noscript',
            'object',
            'ol',
            'optgroup',
            'option',
            'output',
            'p',
            'param',
            'pre',
            'progress',
            'queue',
            'rp',
            'rt',
            'ruby',
            's',
            'samp',
            'script',
            'style',
            'section',
            'select',
            'small',
            'source',
            'span',
            'strike',
            'strong',
            'sub',
            'summary',
            'sup',
            'table',
            'tbody',
            'td',
            'textarea',
            'tfoot',
            'th',
            'thead',
            'time',
            'title',
            'tr',
            'track',
            'u',
            'ul',
            'var',
            'video',
            'wbr',
            'center',
          ],
          htmlAllowedAttrs: [
            'data-atwho-at-query',
            'data-section',
            'data-section-wrapper',
            'accept',
            'accept-charset',
            'accesskey',
            'action',
            'align',
            'allowfullscreen',
            'alt',
            'async',
            'autocomplete',
            'autofocus',
            'autoplay',
            'autosave',
            'background',
            'bgcolor',
            'border',
            'charset',
            'cellpadding',
            'cellspacing',
            'checked',
            'cite',
            'class',
            'color',
            'cols',
            'colspan',
            'content',
            'contenteditable',
            'contextmenu',
            'controls',
            'coords',
            'data',
            'data-.*',
            'datetime',
            'default',
            'defer',
            'dir',
            'dirname',
            'disabled',
            'download',
            'draggable',
            'dropzone',
            'enctype',
            'for',
            'form',
            'formaction',
            'frameborder',
            'headers',
            'height',
            'hidden',
            'high',
            'href',
            'hreflang',
            'http-equiv',
            'icon',
            'id',
            'ismap',
            'itemprop',
            'keytype',
            'kind',
            'label',
            'lang',
            'language',
            'list',
            'loop',
            'low',
            'max',
            'maxlength',
            'media',
            'method',
            'min',
            'mozallowfullscreen',
            'multiple',
            'name',
            'novalidate',
            'open',
            'optimum',
            'pattern',
            'ping',
            'placeholder',
            'poster',
            'preload',
            'pubdate',
            'radiogroup',
            'readonly',
            'rel',
            'required',
            'reversed',
            'rows',
            'rowspan',
            'sandbox',
            'scope',
            'scoped',
            'scrolling',
            'seamless',
            'selected',
            'shape',
            'size',
            'sizes',
            'span',
            'src',
            'srcdoc',
            'srclang',
            'srcset',
            'start',
            'step',
            'summary',
            'spellcheck',
            'style',
            'tabindex',
            'target',
            'title',
            'type',
            'translate',
            'usemap',
            'value',
            'valign',
            'webkitallowfullscreen',
            'width',
            'wrap',
          ],

          toolbarButtons: [
            'bold',
            'italic',
            'underline',
            'strikeThrough',
            'quote',
            'clearFormatting',
            '-',
            'formatOL',
            'formatUL',
            'indent',
            'outdent',
            'token',
            'insertLink',
          ],

          toolbarContainer: editor.RichTextEditor.getToolbarEl(),
          linkEditButtons: ['linkOpen', 'linkRemove'],
        });

        // @todo remove froalaEditor
        $(el).on('froalaEditor.popups.show.link.edit', () => {
          // Get the link DOM object of the current selection.
          const currentLink = $(el).froalaEditor('link.get');

          // Get popup link.edit
          const popupLink = $(el).froalaEditor('popups.get', 'link.edit');

          if (typeof currentLink !== 'undefined') {
            const { top } = currentLink.getBoundingClientRect();
            const height = $(currentLink).outerHeight();

            // Set position of link popup
            popupLink.css('top', parseInt(top, 10) + parseInt(height, 10) + 35);
          }
        });

        return rte;
      },
      disable(el) {
        // Remove events and destroy rte
        $(el).off('froalaEditor.popups.show.link.edit');
        $(el).froalaEditor('destroy');
      },
    });
  }

  // Load other parts
  loadCommands(editor, config);
  loadListeners(editor, config);
  loadComponents(editor, config);
  loadEvents(editor, config);
  loadButtons(editor, config);
  loadBlocks(editor, config);
};
