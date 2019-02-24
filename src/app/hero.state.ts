import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { State, Action, StateContext, Selector } from '@ngxs/store';

import { Hero } from './hero';
import { HeroAction } from './hero.actions';
import { HeroService } from './hero.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

export class HeroStateModel {
  readonly selectedHero: Hero;
  readonly heroes: Hero[];
}

@State<HeroStateModel>({
  name: 'heroes',
  defaults: {
    selectedHero: null,
    heroes: []
  }
})

export class HeroState {

  private heroesUrl = 'api/heroes';  // Web APIのURL

  constructor(
    private http: HttpClient,
    private heroService: HeroService
  ) { }

  //////// Selector //////////
  /** ヒーロー一覧 **/
  @Selector()
  static getHeroes(state: HeroStateModel) {
    return state.heroes;
  }

  /** 選択中のヒーロー **/
  @Selector()
  static getSelectedHero(state: HeroStateModel) {
    return state.selectedHero;
  }

  //////// Load methods //////////
  /** サーバーからヒーローを取得する */
  @Action(HeroAction.Load)
  load(ctx: StateContext<HeroStateModel>) {
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap( heroes => {
         this.heroService.log('fetched heroes');
         ctx.patchState({
           heroes: heroes
         });
        }),
        catchError(this.heroService.handleError('getHeroes', []))
      )
  }

  /** IDによりヒーローを選択する。*/
  @Action(HeroAction.Select)
  select(ctx: StateContext<HeroStateModel>, action: HeroAction.Select) {
    const id = action.id;
    const state = ctx.getState();
    const selectedHero = state.heroes.find(hero => hero.id === id);

    ctx.patchState({ selectedHero: selectedHero });
  }

  //////// Save methods //////////

  /** POST: サーバーに新しいヒーローを登録する */
  @Action(HeroAction.Add)
  addHero(ctx: StateContext<HeroStateModel>, action: HeroAction.Add): Observable<Hero> {
    const hero = action.payload;

    return this.http.post<Hero>(this.heroesUrl, hero, httpOptions).pipe(
      tap((data: Hero) => {
        this.heroService.log(`added hero w/ id=${data.id}`);
        ctx.dispatch(new HeroAction.Load());
      }),
      catchError(this.heroService.handleError<Hero>('addHero'))
    );
  }

  /** DELETE: サーバーからヒーローを削除 */
  @Action(HeroAction.Delete)
  deleteHero(ctx: StateContext<HeroStateModel>, action: HeroAction.Delete): Observable<Hero> {
    // hero: Hero | number): Observable<Hero> {
    const hero = action.payload;
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, httpOptions).pipe(
      tap(_ => {
        this.heroService.log(`deleted hero id=${id}`);
        ctx.dispatch(new HeroAction.Load());
      }),
      catchError(this.heroService.handleError<Hero>('deleteHero'))
    );
  }

  /** PUT: サーバー上でヒーローを更新 */
  @Action(HeroAction.Update)
  updateHero(ctx: StateContext<HeroStateModel>, action: HeroAction.Update): Observable<any> {
    const hero = action.payload;

    return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
      tap(_ => this.heroService.log(`updated hero id=${hero.id}`)),
      catchError(this.heroService.handleError<any>('updateHero'))
    );
  }
}
