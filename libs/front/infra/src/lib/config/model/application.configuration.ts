import { ConfigurationDto } from '@owl/shared/contracts';

import { ApplicationEnvironment } from './application-environment';

export interface ApplicationConfiguration
  extends ConfigurationDto,
    ApplicationEnvironment {}
