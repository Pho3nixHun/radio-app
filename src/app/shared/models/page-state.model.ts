/**
 * PageState model
 * Represents the state of a page
 * Can be in one of three states:
 *   - Loading
 *   - Error
 *   - Success
 * The generic type T represents the view model of the page
 * The view model is the data that the page needs to render,
 * but sometimes the page needs to show a loading spinner or an error message,
 * so the state of the page is represented by this model.
 */

export interface PageStateLoading {
    vm: null;
    loading: true;
    error: null;
}

export interface PageStateError {
    vm: null;
    loading: false;
    error: Error;
}

export interface PageStateSuccess<T> {
    vm: T;
    loading: false;
    error: null;
}

export type PageState<T> = 
    | PageStateLoading
    | PageStateError
    | PageStateSuccess<T>;