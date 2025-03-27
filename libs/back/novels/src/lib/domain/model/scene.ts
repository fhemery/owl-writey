import { SceneGeneralInfo } from './scene-general-info';

export class Scene {
  constructor(
    readonly id: string,
    readonly generalInfo: SceneGeneralInfo,
    readonly text: string
  ) {}
}
