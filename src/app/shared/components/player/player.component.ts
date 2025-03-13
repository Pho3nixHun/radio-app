import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { PlayerService } from '@services/player/player.service';
import { toNumber } from '@utils';

/**
 * Component responsible for rendering the player
 */
@Component({
  selector: 'app-player',
  imports: [AsyncPipe],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss'
})
export class PlayerComponent {
  private readonly playerService = inject(PlayerService);
  protected state$ = this.playerService.getState$();

  protected onPlay = (): void => this.playerService.play();
  protected onPause = (): void => this.playerService.pause();
  protected onVolumeChange = (volume: string | number): void => this.playerService.setVolume(toNumber(volume, 0) / 100);
  protected onMute = (isMuted: boolean): void => this.playerService.setMute(isMuted);

}
