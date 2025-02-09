import { exec as execNoPromise } from 'child_process';
import * as fs from 'fs/promises';
import * as util from 'util';

const exec = util.promisify(execNoPromise);
export const compileHelpers = {
  async copyPackageJson(targetPath: string): Promise<void> {
    console.log(`Copying package.json into ${targetPath}...`);
    await fs.cp('package.json', `${targetPath}/package.json`);

    const packageJson = await fs.readFile(`${targetPath}/package.json`);
    const data = packageJson.toString('utf-8').split('\n');

    const elementsToDiscard = ['"postinstall"', '"prepare"'];
    const cleanData = data.filter(
      (line) => !elementsToDiscard.some((d) => line.includes(d))
    );

    await fs.writeFile(`${targetPath}/package.json`, cleanData.join('\n'));

    await fs.cp('package-lock.json', `${targetPath}/package-lock.json`);
    console.log('Copying package.json into back...DONE!');
  },
  async clearFolder(folder: string): Promise<void> {
    console.log(`Cleaning up dist folder ${folder}...`);
    try {
      await fs.stat(folder);
      await fs.rm(folder, { recursive: true });
    } catch (e) {
      console.log('Directory does not exist, nevermind');
    }
    console.log('Cleaning up dist folder... DONE');
  },
  async executeShellCommand(command: string): Promise<void> {
    const { stdout, stderr } = await exec(command);
    console.log(stdout);
    console.log(stderr);
  },
};
