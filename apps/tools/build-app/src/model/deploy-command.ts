import { DeployApp } from './deploy-app';

export interface DeployCommand {
  app: DeployApp;
  version: string;
  dryRun: boolean;
}
