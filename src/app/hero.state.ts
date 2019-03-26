import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';

import { State, Action, StateContext, Selector } from '@ngxs/store';

import { Hero } from './hero';
import { HeroAction } from './hero.actions';
import { HeroService } from './hero.service';

export class HeroStateModel {
  selectedHero: Hero;
  heroes: Hero[];
}

@State<HeroStateModel>({
  name: 'heroes',
  defaults: {
    selectedHero: null,
    heroes: []
  }
})

export class HeroState {

  constructor(
    private heroService: HeroService
  ) { }

  //////// Selector //////////
  /** ヒーロー一覧 **/
  @Selector()
  static heroes(state: HeroStateModel) {
    return state.heroes;
  }

  /** 選択中のヒーロー **/
  @Selector()
  static selectedHero(state: HeroStateModel) {
    return state.selectedHero;
  }

  //////// Load methods //////////
  /** サーバーからヒーローを取得する */
  @Action(HeroAction.Load)
  load(ctx: StateContext<HeroStateModel>) {
    return this.heroService.getHeroes()
      .pipe(
        tap((data) => {
         ctx.patchState({
           heroes: data
         });
        }),
      )
  }

  /** IDによりヒーローを選択する。*/
  @Action(HeroAction.Select)
  select(ctx: StateContext<HeroStateModel>, action: HeroAction.Select) {
    const id = action.id;
    return this.heroService.getHero(id)
      .pipe(
        tap((data: Hero) => {
         ctx.patchState({
           selectedHero: data
         });
        }),
      )
  }

  //////// Save methods //////////

  /** POST: サーバーに新しいヒーローを登録する */
  @Action(HeroAction.Add)
  addHero(ctx: StateContext<HeroStateModel>, action: HeroAction.Add) {
    const hero = action.payload;

    return this.heroService.addHero(hero).pipe(
      finalize(() => {
        ctx.dispatch(new HeroAction.Load());
      })
    );
  }

  /** DELETE: サーバーからヒーローを削除 */
  @Action(HeroAction.Delete)
  deleteHero(ctx: StateContext<HeroStateModel>, action: HeroAction.Delete) {
    const hero = action.payload;
    const id = typeof hero === 'number' ? hero : hero.id;

    return this.heroService.deleteHero(hero).pipe(
      finalize(() => {
        ctx.dispatch(new HeroAction.Load());
      }),
    );
  }

  /** PUT: サーバー上でヒーローを更新 */
  @Action(HeroAction.Update)
  updateHero(ctx: StateContext<HeroStateModel>, action: HeroAction.Update): Observable<any> {
    const hero = action.payload;

    return this.heroService.updateHero(hero);
  }
}
