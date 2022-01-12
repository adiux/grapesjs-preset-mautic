import ViewsApplyCommand from './views.apply.command';

export default (editor) => {
  editor.Commands.add(ViewsApplyCommand.name, {
    run: ViewsApplyCommand.applyEmail,
  });
};
