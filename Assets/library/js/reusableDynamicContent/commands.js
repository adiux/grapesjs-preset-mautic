import ReusableDynamicContentCommands from './reusableDynamicContent.commands';

export default (editor) => {
  const reusableDynamicContentCmd = new ReusableDynamicContentCommands(editor);

  editor.Commands.add('preset-mautic:reusable-dynamic-content-open', {
    run: (editor, sender, options = {}) => {
      reusableDynamicContentCmd.showReusableDynamicContentPopup(editor, sender, options);
    },
  });
};
