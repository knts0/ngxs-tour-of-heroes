import { Hero } from './hero';

export module HeroAction {

  export const LOAD_HERO = 'Load_Hero';

  export class Load {
    static readonly type = LOAD_HERO;
  }
}
