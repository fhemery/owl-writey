import { app, moduleTestInit } from './module-test-init';

describe('Ping', () => {
  moduleTestInit();

  it('should return "pong"', async () => {
    const response = await app.get('/api/ping');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});
