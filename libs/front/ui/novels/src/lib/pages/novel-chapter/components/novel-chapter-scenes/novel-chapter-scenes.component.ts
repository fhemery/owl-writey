
import { Component, CUSTOM_ELEMENTS_SCHEMA,EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

import { NovelCorkboardComponent } from '../../../novel-main/components/novel-corkboard/novel-corkboard.component';
import { ChapterPageSceneViewModel,ChapterPageViewModel } from '../../model/chapter-page.view-model';
import { NovelSceneCardComponent } from '../novel-scene-card/novel-scene-card.component';

@Component({
  selector: 'owl-novel-chapter-scenes',
  standalone: true,
  imports: [
    MatIconModule,
    TranslateModule,
    NovelCorkboardComponent,
    NovelSceneCardComponent
],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './novel-chapter-scenes.component.html',
  styleUrls: ['./novel-chapter-scenes.component.scss'],
})
export class NovelChapterScenesComponent {
  @Input() chapter!: ChapterPageViewModel;
  
  @Output() sceneAdded = new EventEmitter<number>();
  @Output() sceneMoved = new EventEmitter<{ from: number; to: number }>();
  @Output() sceneTitleUpdated = new EventEmitter<{ title: string; sceneId: string }>();
  @Output() sceneOutlineUpdated = new EventEmitter<{ outline: string; sceneId: string }>();
  @Output() scenePovUpdated = new EventEmitter<{ povId: string | undefined; sceneId: string }>();
  @Output() sceneDeleted = new EventEmitter<string>();
  @Output() sceneTransferred = new EventEmitter<string>();
  @Output() navigateToScene = new EventEmitter<string>();

  convertToScene(item: unknown): ChapterPageSceneViewModel {
    return item as ChapterPageSceneViewModel;
  }

  addSceneAt(index?: number): void {
    this.sceneAdded.emit(index);
  }

  moveScene(event: { from: number; to: number }): void {
    this.sceneMoved.emit(event);
  }

  onMoveScene(index: number, offset: number): void {
    this.sceneMoved.emit({ from: index, to: index + offset });
  }

  updateSceneTitle(title: string, sceneId: string): void {
    this.sceneTitleUpdated.emit({ title, sceneId });
  }

  updateSceneOutline(outline: string, sceneId: string): void {
    this.sceneOutlineUpdated.emit({ outline, sceneId });
  }

  updateScenePov(povId: string | undefined, sceneId: string): void {
    this.scenePovUpdated.emit({ povId, sceneId });
  }

  deleteScene(sceneId: string): void {
    this.sceneDeleted.emit(sceneId);
  }

  transferScene(sceneId: string): void {
    this.sceneTransferred.emit(sceneId);
  }

  goToScene(sceneId: string): void {
    this.navigateToScene.emit(sceneId);
  }
}
