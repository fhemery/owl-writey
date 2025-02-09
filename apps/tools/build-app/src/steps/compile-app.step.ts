import { exec as execNoPromise } from 'child_process';
import * as fs from 'fs/promises';
import * as util from 'util';

import { Step } from './step';

const exec = util.promisify(execNoPromise);
export class CompileAppStep implements Step {
  static readonly TargetPath = 'dist/apps/app';

  async execute(): Promise<void> {
    console.log('process cwd', process.cwd());
    await this.clearExistingBuilds();
    await this.buildProd();
    await this.renameFolderToMatchConvention();
  }

  async clearExistingBuilds(): Promise<void> {
    await this.clearFolder('dist/apps/back');
    await this.clearFolder('dist/apps/front');
  }

  async clearFolder(folder: string): Promise<void> {
    console.log(`Cleaning up dist folder ${folder}...`);
    try {
      await fs.stat(folder);
      await fs.rm(folder, { recursive: true });
    } catch {
      console.log('Directory does not exist, nevermind');
    }
    console.log('Cleaning up dist folder... DONE');
  }

  async buildProd(): Promise<void> {
    await this.compileBack('production');
    await this.compileFront('production');
    await this.copyFrontToBack('production');
  }

  async compileBack(env: 'production' | 'recette'): Promise<void> {
    console.log(`Compiling back for ${env}...`);
    await this.executeShellCommand(`npm run nx -- run back:build:${env}`);
    console.log('Compiling back...DONE!');
  }

  private async executeShellCommand(command: string): Promise<void> {
    const { stdout, stderr } = await exec(command);
    console.log(stdout);
    console.log(stderr);
  }

  async compileFront(env: 'production' | 'recette'): Promise<void> {
    console.log(`Compiling front for ${env}...`);
    await this.executeShellCommand(`npm run nx -- run front:build:${env}`);
    console.log('Compiling front...DONE!');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async copyFrontToBack(env: 'recette' | 'production'): Promise<void> {
    console.log('Copying front into back...');
    await fs.mkdir(`dist/apps/back/client`, {
      recursive: true,
    });
    await fs.cp(`dist/apps/front/browser`, `dist/apps/back/client`, {
      recursive: true,
    });
    console.log('Copying front into back...DONE!');
  }

  private async renameFolderToMatchConvention(): Promise<void> {
    console.log('Copying to "app" folder...');
    await this.clearFolder('dist/apps/app');
    await fs.cp('dist/apps/back', 'dist/apps/app', {
      recursive: true,
    });
    console.log('Copying to "app" folder...DONE!');
  }
}
