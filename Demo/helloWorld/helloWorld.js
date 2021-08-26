/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-expressions */
import 'grapesjs/dist/css/grapes.min.css';
import grapesjs from 'grapesjs';
<<<<<<< HEAD
=======
import 'grapesjs-plugin-ckeditor';
>>>>>>> features


const editor = grapesjs.init({
  fromElement: 1,
  container: '#gjs',
  height: '100%',
  avoidInlineStyle: false,
<<<<<<< HEAD
  plugins: [],
=======
  plugins: ['gjs-plugin-ckeditor'],
  pluginsOpts: {
    'gjs-plugin-ckeditor': {}
  }
>>>>>>> features
});

// add custom fonts options on editor's font list
// editor.on('load', () => {
//   let styleManager = editor.StyleManager;
//   let fontProperty = styleManager.getProperty('typography', 'font-family');

//   let list = [];
//   // empty list
//   fontProperty.set('list', list);

//   // custom list
//   list.push(fontProperty.addOption({ value: 'Montserrat, sans-serif', name: 'Montserrat' }));
//   list.push(fontProperty.addOption({ value: 'Open Sans, sans-serif', name: 'Open Sans' }));
//   fontProperty.set('list', list);

//   styleManager.render();
// });
