import { ConfigurationDto } from '@owl/shared/common/contracts';

import { ApplicationEnvironment } from './application-environment';

export interface ApplicationConfiguration
  extends ConfigurationDto,
    ApplicationEnvironment {}
