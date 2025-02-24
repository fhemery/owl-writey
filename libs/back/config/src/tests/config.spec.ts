import { ConfigurationDto } from '@owl/shared/contracts';

import { app, moduleTestInit, url } from './module-test-init';

describe('GET /config', () => {
  moduleTestInit();

  it('should return the correct configuration variables', async () => {
    const configResponse = await app.get<ConfigurationDto>('/api/config');
    expect(configResponse.status).toBe(200);

    expect(configResponse.body?.baseUrl).toBe(url);
  });
});
