import { Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PaginationVM {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  maxPageButtons: number;
}

/**
 * A reusable component for handling pagination UI and events
 */
@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
  /**
   * Input for the pagination view model
   */
  public vm = input.required<PaginationVM>();

  /**
   * Event emitted when a page change is requested
   */
  protected pageChange = output<number>();
  
  /**
   * Calculates the total number of pages based on items and page size
   */
  protected totalPages = computed(() => Math.max(1, Math.ceil(this.vm().totalItems / this.vm().pageSize)));
  
  /**
   * Determines if the previous button should be disabled
   */
  protected isPreviousDisabled = computed(() => this.vm().currentPage <= 1);

  /**
   * Determines if the next button should be disabled
   */
  protected isNextDisabled = computed(() => this.vm().currentPage >= this.totalPages());
  
  /**
   * Calculates the page numbers to be displayed
   */
  protected visiblePages = computed(() => {
    const halfButtons = Math.floor(this.vm().maxPageButtons / 2);
    let startPage = Math.max(1, this.vm().currentPage - halfButtons);
    const endPage = Math.min(this.totalPages(), startPage + this.vm().maxPageButtons - 1);
    startPage = Math.max(1, endPage - this.vm().maxPageButtons + 1);
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  });
  
  /**
   * Handles click on a specific page number
   */
  protected onPageClick(page: number): void {
    if (page !== this.vm().currentPage && page >= 1 && page <= this.totalPages()) {
      this.pageChange.emit(page);
    }
  }
  
  /**
   * Handles click on the previous page button
   */
  protected onPreviousClick(): void {
    if (!this.isPreviousDisabled()) {
      this.pageChange.emit(this.vm().currentPage - 1);
    }
  }
  
  /**
   * Handles click on the next page button
   */
  protected onNextClick(): void {
    if (!this.isNextDisabled()) {
      this.pageChange.emit(this.vm().currentPage + 1);
    }
  }
  
  /**
   * Handles click on the first page button
   */
  protected onFirstClick(): void {
    if (!this.isPreviousDisabled()) {
      this.pageChange.emit(1);
    }
  }
  
  /**
   * Handles click on the last page button
   */
  protected onLastClick(): void {
    if (!this.isNextDisabled()) {
      this.pageChange.emit(this.totalPages());
    }
  }
}