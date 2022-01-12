import ViewsSaveCommand from './views.save.command';

export default (editor) => {
  editor.Commands.add(ViewsSaveCommand.name, {
    run: ViewsSaveCommand.saveEmail,
  });
};
