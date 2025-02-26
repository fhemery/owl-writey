import commandLineArgs from 'command-line-args';
import * as dotenv from 'dotenv';

import { DeployCommand } from './model/deploy-command';
import { CompileAppStep } from './steps/compile-app.step';
import { SetupPackageJsonStep } from './steps/setup-package-json.step';

dotenv.config();

function parseCommandLine(): DeployCommand {
  const optionDefinitions = [
    { name: 'version', alias: 'v', type: String },
    { name: 'dry-run', type: Boolean },
  ];
  const args = commandLineArgs(optionDefinitions);
  //   if (!args.version) {
  //     throw new Error('Version argument is mandatory');
  //   }
  return {
    ...args,
    dryRun: args['dry-run'] || false,
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function compileApp(command: DeployCommand): Promise<void> {
  const compileStep = new CompileAppStep();
  const packageJsonStep = new SetupPackageJsonStep(['dist/apps/app']);

  await compileStep.execute();
  await packageJsonStep?.execute();
}

async function doBuild(): Promise<void> {
  const command = parseCommandLine();
  console.log(
    `Publishing app: ${command.app}, version: ${command.version}, dryRun: ${command.dryRun}`
  );

  await compileApp(command);
}

void doBuild();
