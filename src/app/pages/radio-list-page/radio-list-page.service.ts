import { inject, Injectable } from '@angular/core';
import { RadioEntry, RadioSearchOrder } from '@app/shared/models/radio.model';
import { RadioService } from '@app/shared/services/radio/radio.service';
import { BehaviorSubject,
  catchError,
  combineLatest,
  map,
  Observable,
  of,
  startWith,
  switchMap
} from 'rxjs';
import { RadioListPageState, XRadioEntry } from './radio-list-page.model';
import { FavoriteService } from '@app/shared/services/favorite/favorite.service';

const isRadioFavorite = (
  radio: RadioEntry,
  favorites: RadioEntry[] | null
): boolean => favorites?.some(favorite => favorite.id === radio.id) ?? false;

const toXRadioEntry = (radio: RadioEntry, favorites: RadioEntry[] | null): XRadioEntry => ({
  ...radio,
  favorite: isRadioFavorite(radio, favorites)
});
/**
 * Service responsible for generating the state of the radio list page
 */

@Injectable({
  providedIn: 'root'
})
export class RadioListPageService {
  private readonly radioService = inject(RadioService);
  private readonly favoriteService = inject(FavoriteService);

  private readonly currentPage$ = new BehaviorSubject<number>(1);
  private readonly pageSize$ = new BehaviorSubject<number>(10);
  private readonly sortOrder$ = new BehaviorSubject<RadioSearchOrder>(RadioSearchOrder.ClickCount);
  private readonly hideOffline$ = new BehaviorSubject<boolean>(true);
  private readonly reverse$ = new BehaviorSubject<boolean>(true);
  private readonly radioCount$ = this.radioService.radioStats$.pipe(
    map(stats => stats.stationCount)
  )
  private readonly brokenRadioCount$ = this.radioService.radioStats$.pipe(
    map(stats => stats.stationBrokenCount)
  )

  public getState$ = (): Observable<RadioListPageState> => combineLatest({
      currentPage: this.currentPage$,
      pageSize: this.pageSize$,
      sortOrder: this.sortOrder$,
      hideOffline: this.hideOffline$,
      reverse: this.reverse$,
      radioCount: this.radioCount$,
      brokenRadioCount: this.brokenRadioCount$,
      favorites: this.favoriteService.getFavorites$()
    }).pipe(
      switchMap(({
        currentPage,
        pageSize,
        sortOrder,
        hideOffline,
        reverse,
        radioCount,
        brokenRadioCount,
        favorites
      }) => 
        this.radioService.getRadioList$({
          order: sortOrder,
          reverse,
          limit: pageSize,
          offset: (currentPage - 1) * pageSize,
          hidebroken: hideOffline
        }).pipe(
          map((radioEntries) => ({
            vm: {
              radioEntries: radioEntries.map(radio => toXRadioEntry(radio, favorites)),
              paginationVM: {
                currentPage,
                totalItems: hideOffline ? radioCount - brokenRadioCount : radioCount,
                pageSize,
                maxPageButtons: 25
              },
              favorites: favorites.map(favorite => toXRadioEntry(favorite, favorites)),
              sortByOptionVMs: [
                {
                  value: RadioSearchOrder.Name,
                  label: 'Name',
                  selected: sortOrder === RadioSearchOrder.Name
                },
                {
                  value: RadioSearchOrder.ClickCount,
                  label: 'Popularity',
                  selected: sortOrder === RadioSearchOrder.ClickCount
                },
                {
                  value: RadioSearchOrder.Bitrate,
                  label: 'Bitrate',
                  selected: sortOrder === RadioSearchOrder.Bitrate
                },
                {
                  value: RadioSearchOrder.Random,
                  label: 'Random',
                  selected: sortOrder === RadioSearchOrder.Random
                },
                {
                  value: RadioSearchOrder.Votes,
                  label: 'Votes',
                  selected: sortOrder === RadioSearchOrder.Votes
                },
                {
                  value: RadioSearchOrder.Country,
                  label: 'Country',
                  selected: sortOrder === RadioSearchOrder.Country
                }
              ],
              pageSizeOptionVMs: [
                { value: 10, label: '10 stations', selected: pageSize === 10 },
                { value: 25, label: '25 stations', selected: pageSize === 25 },
                { value: 50, label: '50 stations', selected: pageSize === 50 },
                { value: 100, label: '100 stations', selected: pageSize === 100 }
              ],
              hideOffline,
              empty: radioEntries.length === 0
            },
            loading: false as const,
            error: null
          })),
          startWith({ vm: null, loading: true as const, error: null }),
          catchError(error => of({ vm: null, loading: false as const, error }))
        )
      ),
    )

  public setCurrentPage = (page: number): void => this.currentPage$.next(page);
  public setPageSize = (pageSize: number): void => this.pageSize$.next(pageSize);
  public setSortOrder = (sortOrder: RadioSearchOrder): void => this.sortOrder$.next(sortOrder);
  public setHideOffline = (hideOffline: boolean): void => this.hideOffline$.next(hideOffline);
  public setReverse = (reverse: boolean): void => this.reverse$.next(reverse);

  public setFavorite = (radio: XRadioEntry, favorite: boolean): void => {
    if (favorite) {
      this.favoriteService.setFavorite(radio);
      return;
    }
    this.favoriteService.removeFavorite(radio);
  }
}
