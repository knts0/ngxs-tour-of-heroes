import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Store, Select } from '@ngxs/store';
import { HeroAction } from '../hero.actions';
import { HeroState } from '../hero.state';

import { Hero } from '../hero';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  /** ngxs Selector **/
  @Select(HeroState.getHeroes) heroes$: Observable<Hero[]>

  constructor(
    private store: Store
  ) { }

  ngOnInit() {
    this.getHeroes();
  }

  getHeroes(): void {
    this.store.dispatch(new HeroAction.Load())
  }
}
