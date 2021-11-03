import ReusableDynamicContentCommands from './reusableDynamicContent.commands';

export default (editor, listRDC) => {
  const reusableDynamicContentCmd = new ReusableDynamicContentCommands(editor, listRDC);

  editor.Commands.add('preset-mautic:reusable-dynamic-content-open', {
    run: (editor, sender, options = {}) => {
      reusableDynamicContentCmd.showReusableDynamicContentPopup(editor, sender, options);
    },
  });
};
