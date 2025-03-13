import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RadioCardComponent } from './components/radio-card/radio-card.component';
import { RadioEntry, RadioSearchOrder } from '@models/radio.model';
import { RadioListPageService } from './radio-list-page.service';
import { PaginationComponent } from '@app/shared/components/pagination/pagination.component';
import { toEnum, toNumber } from '@utils';
import { PlayerService } from '@app/shared/services/player/player.service';
import { XRadioEntry } from './radio-list-page.model';

/**
 * Component responsible for rendering the radio list page
 */
@Component({
  selector: 'app-radio-list-page',
  standalone: true,
  imports: [AsyncPipe, FormsModule, RadioCardComponent, PaginationComponent],
  templateUrl: './radio-list-page.component.html',
  styleUrl: './radio-list-page.component.scss'
})
export class RadioListPageComponent {
  // Inject services
  private readonly radioListPageService = inject(RadioListPageService);
  protected state$ = this.radioListPageService.getState$();
  private readonly player = inject(PlayerService);

  protected onSortOrderChange = (order: string): void => this.radioListPageService.setSortOrder(
    toEnum(order, RadioSearchOrder, RadioSearchOrder.ClickCount)
  );
  protected onPageSizeChange = (pageSize: string | number): void => this.radioListPageService.setPageSize(toNumber(pageSize, 10));
  protected onPageChange = (page: string | number): void => this.radioListPageService.setCurrentPage(toNumber(page, 1));
  protected onReverseChange = (reverse: boolean): void => this.radioListPageService.setReverse(reverse);
  protected onHideOfflineChange = (hideOffline: boolean): void => this.radioListPageService.setHideOffline(hideOffline);

  protected onTune = (radioEntry: RadioEntry): Promise<void> => this.player.tune(radioEntry);
  protected onFavorite = (radioEntry: XRadioEntry): void => this.radioListPageService.setFavorite(radioEntry, !radioEntry.favorite);
  
  // Expose enum to template
  protected readonly RadioSearchOrder = RadioSearchOrder;
}