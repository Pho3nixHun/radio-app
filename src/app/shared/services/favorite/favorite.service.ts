import { Injectable } from "@angular/core";
import { RadioEntry } from "@app/shared/models/radio.model";
import { BehaviorSubject, Observable, shareReplay } from "rxjs";

const FAVORITE_KEY = "favorite";

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  
  public getFavoritesFromStorage = (): RadioEntry[] => {
    const favorites = localStorage.getItem(FAVORITE_KEY);
    return favorites ? JSON.parse(favorites) : [];
  }
  
  private readonly favorites$ = new BehaviorSubject<RadioEntry[]>(this.getFavoritesFromStorage());
  
  public getFavorites$ = (): Observable<RadioEntry[]> => this.favorites$.asObservable();

  public setFavorites(favorites: RadioEntry[]) {
    localStorage.setItem(FAVORITE_KEY, JSON.stringify(favorites));
    this.favorites$.next(favorites);
  }

  public async setFavorite(favorite: RadioEntry) {
    const favorites = this.favorites$.value;
    this.setFavorites([...favorites, favorite]);
  }

  public async removeFavorite(favorite: RadioEntry) {
    const favorites = this.favorites$.value;
    this.setFavorites(favorites.filter(fav => fav.id !== favorite.id));
  }
}
