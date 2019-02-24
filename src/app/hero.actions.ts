import { Hero } from './hero';

export module HeroAction {

  export const LOAD_HERO = 'Load_Hero';
  export const SELECT_HERO = 'Select_Hero';
  export const ADD_HERO = 'Add_Hero';
  export const DELETE_HERO = 'Delete_Hero';
  export const UPDATE_HERO = 'Update_Hero';

  export class Load {
    static readonly type = LOAD_HERO;
  }

  export class Select {
    static readonly type = SELECT_HERO;

    constructor(public id: number) {}
  }

  export class Add {
    static readonly type = ADD_HERO;

    constructor(public payload: Hero) {}
  }

  export class Delete {
    static readonly type = DELETE_HERO;

    constructor(public payload: Hero) {}
  }

  export class Update {
    static readonly type = UPDATE_HERO;

    constructor(public payload: Hero) {}
  }
}
