import { exec as execNoPromise } from 'child_process';
import * as util from 'util';

import { DeployApp } from '../model/deploy-app';
import { Step } from './step';

const exec = util.promisify(execNoPromise);

export class VersionStep implements Step {
  constructor(
    readonly app: DeployApp,
    readonly version: string,
    readonly isDryRun: boolean
  ) {}

  async execute(): Promise<void> {
    await this.checkVersionDoesNotExistAlready();
    await this.tagVersion();
  }

  private async checkVersionDoesNotExistAlready(): Promise<void> {
    const tag = this.getTag();
    console.log(`Checking version ${tag} does not exist already...`);
    const { stdout } = await exec(`git tag -l ${tag}`);
    if (stdout) {
      throw new Error(`Version ${this.version} already exists`);
    }
    console.log(
      `Checking version ${this.version} does not exist already... DONE`
    );
  }

  private getTag(): string {
    return `${this.app}-${this.version}`;
  }

  private async tagVersion(): Promise<void> {
    console.log(`Tagging version ${this.version}...`);
    const tag = this.getTag();
    if (!this.isDryRun) {
      await exec(`git tag ${tag}`);
      await exec(`git push origin ${tag}`);
    }
    console.log(`Tagging version ${this.version}... DONE`);
  }
}
