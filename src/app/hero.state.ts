import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { State, Action, StateContext, Selector } from '@ngxs/store';

import { Hero } from './hero';
import { HeroAction } from './hero.actions';
import { MessageService } from './message.service';

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

  /** HeroServiceのメッセージをMessageServiceを使って記録 */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}
