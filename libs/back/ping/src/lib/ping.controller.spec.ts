import { Test } from '@nestjs/testing';
import { PingController } from './ping.controller';

describe('PingController', () => {
  let controller: PingController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [],
      controllers: [PingController],
    }).compile();

    controller = module.get(PingController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
