import Generator from 'yeoman-generator';

export default class ProviderGenerator extends Generator {
  async prompting() {
    const {name, license, skipGit, owner, repo, skipInstall, packageManager} = this.options;

    const answers = await this.prompt([{
      name:    'name',
      message: 'directory name',
      when:    !name
    }, {
      name:    'license',
      default: 'MIT',
      when:    !license
    }, {
      name:    'owner',
      message: 'Who is the GitHub owner of repository (https://github.com/OWNER/repo)',
      default: await this.user.github.username(),
      when:    !skipGit && !owner
    }, {
      name:    'repo',
      message: 'What is the GitHub name of repository (https://github.com/owner/REPO)',
      default: memo => name || memo.name,
      when:    !skipGit && !repo
    }, {
      name:    'packageManager',
      message: 'Select a package manager',
      type:    'list',
      choices: ['yarn', 'npm'],
      when:    !skipInstall && !packageManager
    }]);

    this.inputs = Object.assign({}, this.options, answers);
  }

  writing() {
    const root = this.destinationRoot(this.inputs.name);

    this.renderTemplate('**/*', '.', this.inputs, null, {
      processDestinationPath: (fullPath) => {
        const relativePath = fullPath.slice(root.length + 1);

        return this.destinationPath(relativePath.replace(/(?<=^|\/)_/g, '.'));
      }
    });
  }

  install() {
    const {skipInstall, packageManager} = this.inputs;

    if (skipInstall) { return; }

    this.installDependencies({
      yarn:  packageManager === 'yarn',
      npm:   packageManager === 'npm',
      bower: false
    });
  }

  end() {
    const {skipGit, owner, repo, name} = this.inputs;

    if (skipGit) { return; }

    this.spawnCommandSync('git', ['init']);
    this.spawnCommandSync('git', ['remote', 'add', 'origin', `https://github.com/${owner}/${repo}.git`]);
    this.spawnCommandSync('git', ['add', '--all']);
    this.spawnCommandSync('git', ['commit', '--message', `Initialize new stanza provider: ${name}`]);
  }
};