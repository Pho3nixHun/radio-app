import { Injectable } from '@angular/core';
import { BehaviorSubject,
  catchError,
  combineLatest,
  from,
  map,
  Observable,
  of,
  shareReplay,
  startWith,
  switchScan
} from 'rxjs';
import { RadioEntry } from '@models/radio.model';

export interface PlayerState {
  isPlaying: boolean;
  isBuffering: boolean;
  currentRadio: RadioEntry | null;
  volume: number;
  isMuted: boolean;
  error: Error | null;
}

/**
 * Service responsible for managing radio playback
 */
@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  // Audio element for playback
  private readonly playerState$ = new BehaviorSubject<PlayerState>({
    isPlaying: false,
    isBuffering: false,
    currentRadio: null,
    volume: 0.25,
    isMuted: false,
    error: null
  });


  private readonly audioElement$ = this.playerState$.pipe(
    switchScan<
        PlayerState,
        HTMLAudioElement|null,
        Observable<HTMLAudioElement|null>
    >((acc, state) => {
        const { currentRadio } = state;
        const { url } = currentRadio ?? {};
        if (!currentRadio || !url) {
            acc?.pause();
            return of(null);
        }
        const previousRadioId = acc?.getAttribute('data-radio-id') ?? null;
        const currentRadioId = currentRadio.id;
        const isSame = acc && previousRadioId === currentRadioId;
        if (!isSame) {
            acc?.pause();
        }
        const audio = isSame ? acc : new Audio(url.toString());
        audio.volume = state.isMuted ? 0 : state.volume;
        audio.setAttribute('data-radio-id', state.currentRadio?.id.toString() ?? '');
        if (state.isPlaying && audio.paused) {
            return from(audio.play()).pipe(
                map(() => audio),
                startWith(audio),
                catchError(err => {
                    // Side effect: handle playback errors
                    this.handleError(err);
                    return of(null);
                })
            );
        }
        if (!state.isPlaying) {
            audio.pause();
        }
        return of(audio);
    }, null),
    startWith(null),
    shareReplay(1)
  );

  public getState$(): Observable<PlayerState> {
    return combineLatest([this.playerState$, this.audioElement$]).pipe(
        map(([state, audio]) => ({
            ...state,
            isPlaying: audio?.paused ?? false,
            isBuffering: audio?.readyState === HTMLMediaElement.HAVE_NOTHING,
            volume: audio?.volume ?? state.volume,
            isMuted: audio?.muted ?? state.isMuted,
        }))
    );
  }

  /**
   * Action function to tune to a radio station
   * @param radioEntry The radio station to tune to. Can be null.
   */
  public async tune(radioEntry: RadioEntry | null): Promise<void> {
    this.playerState$.next({
      ...this.playerState$.value,
      isPlaying: true,
      isMuted: false,
      error: null,
      currentRadio: radioEntry
    });
  }

  /**
   * Action function to play the current radio station
   */
  public play(): void {
    this.playerState$.next({
      ...this.playerState$.value,
      error: null
    });
  }

  /**
   * Action function to pause the current radio station
   */
  public pause(): void {
    this.playerState$.next({
      ...this.playerState$.value,
      isPlaying: false
    });
  }

  /**
   * Action function to stop the current radio station
   */
  public stop(): void {
    this.playerState$.next({
      ...this.playerState$.value,
      isPlaying: false,
      currentRadio: null
    });
  }

  /**
   * Action function to set the volume of the player
   * @param volume The volume to set the player to
   */
  public setVolume(volume: number): void {
    this.playerState$.next({
    ...this.playerState$.value,
    volume
    });
  }

  /**
   * Action function to mute or unmute the player
   * @param isMuted Whether the player should be muted
   */
  public setMute(isMuted: boolean): void {
    this.playerState$.next({
    ...this.playerState$.value,
    isMuted
    });
  }

  /**
   * Action function to handle playback errors. Since the audio playback is 
   * handled in the service, this function is called internally.
   * @param error Error that occurred during playback
   */
  private handleError(error: Error): void {
    this.playerState$.next({
        ...this.playerState$.value,
        isPlaying: false,
        error
    });
  }
}