import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { State, Action, StateContext, Selector } from '@ngxs/store';

import { Hero } from './hero';
import { HeroAction } from './hero.actions';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

export class HeroStateModel {
  readonly heroes: Hero[];
}

@State<HeroStateModel>({
  name: 'heroes',
  defaults: {
    heroes: []
  }
})

export class HeroState {

  private heroesUrl = 'api/heroes';  // Web APIのURL

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  @Selector()
  static getState(state: HeroStateModel) {
    return state;
  }

  @Selector()
  static getHeroes(state: HeroStateModel) {
    return state.heroes;
  }

  /** サーバーからヒーローを取得する */
  @Action(HeroAction.Load)
  load(ctx: StateContext<HeroStateModel>) {
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap( heroes => {
         this.log('fetched heroes');
         ctx.patchState({
           heroes: heroes
         });
        }),
        // catchError(this.handleError('getHeroes', []))
      )
  }

  //////// Save methods //////////

  /** POST: サーバーに新しいヒーローを登録する */
  @Action(HeroAction.Add)
  addHero(ctx: StateContext<HeroStateModel>, action: HeroAction.Add): Observable<Hero> {
    const hero = action.hero;

    return this.http.post<Hero>(this.heroesUrl, hero, httpOptions).pipe(
      tap((data: Hero) => {
        this.log(`added hero w/ id=${data.id}`);
        ctx.dispatch(new HeroAction.Load());
      }),
      // catchError(this.handleError<Hero>('addHero'))
    );
  }

  /** DELETE: サーバーからヒーローを削除 */
  @Action(HeroAction.Delete)
  deleteHero(ctx: StateContext<HeroStateModel>, action: HeroAction.Delete): Observable<Hero> {
    // hero: Hero | number): Observable<Hero> {
    const hero = action.hero;
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, httpOptions).pipe(
      tap(_ => {
        this.log(`deleted hero id=${id}`);
        ctx.dispatch(new HeroAction.Load());
      }),
      // catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  /** PUT: サーバー上でヒーローを更新 */
  @Action(HeroAction.Update)
  updateHero(ctx: StateContext<HeroStateModel>, action: HeroAction.Update): Observable<any> {
    const hero = action.hero;

    return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
      tap(_ => {
        this.log(`updated hero id=${hero.id}`);
        ctx.dispatch(new HeroAction.Load());
      }),
      // catchError(this.handleError<any>('updateHero'))
    );
  }

  /** HeroServiceのメッセージをMessageServiceを使って記録 */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}
