import { exec as execNoPromise } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as util from 'util';

import { Step } from './step';
const exec = util.promisify(execNoPromise);

const patternsToRemove = [
  '@angular/',
  '@ngrx/',
  '@ngx',
  'd3',
  'ngx-',
  'quill',
  'rxjs',
  'swiper',
  'zone.js',
];

export class SetupPackageJsonStep implements Step {
  constructor(private targetPaths: string[]) {}

  async execute(): Promise<void> {
    const packageJsonContent = await fs.readFile('./package.json', 'utf8');
    const packageJson = JSON.parse(packageJsonContent);
    packageJson['devDependencies'] = {};
    packageJson['scripts'] = {};

    const dependencies = {};

    for (const key in packageJson['dependencies']) {
      if (patternsToRemove.some((pattern) => key.includes(pattern))) {
        continue;
      }
      dependencies[key] = packageJson['dependencies'][key];
    }
    packageJson['dependencies'] = dependencies;

    for (const targetPath of this.targetPaths) {
      await fs.writeFile(
        path.join(targetPath, 'package.json'),
        JSON.stringify(packageJson, null, 2)
      );
      // Execute child command as a promise
      await exec(`cd ${targetPath} && npm i --package-lock-only`);
    }
  }
}
