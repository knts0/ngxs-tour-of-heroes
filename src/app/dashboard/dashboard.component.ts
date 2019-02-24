import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Store, Select } from '@ngxs/store';

import { Hero } from '../hero';
import { HeroAction } from '../hero.actions';
import { HeroState } from '../hero.state';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  /** ngxs Selector **/
  @Select(HeroState.getHeroes) heroes$: Observable<Hero[]>

  constructor(
    // private heroService: HeroService,
    private store: Store
  ) { }

  ngOnInit() {
    this.getHeroes();
  }

  getHeroes(): void {
    // this.heroService.getHeroes()
      // .subscribe(heroes => this.heroes = heroes.slice(1, 5));
    this.store.dispatch(new HeroAction.Load())
  }
}
