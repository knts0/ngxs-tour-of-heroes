import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';

import { Store, Select } from '@ngxs/store';
import { HeroAction } from '../hero.actions';
import { HeroState } from '../hero.state';

import { Hero } from '../hero';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: [ './hero-detail.component.css' ]
})
export class HeroDetailComponent implements OnInit {
  /** ngxs Selector **/
  @Select(HeroState.getSelectedHero) hero$: Observable<Hero>

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    const id = +this.route.snapshot.paramMap.get('id');

    this.store.dispatch(new HeroAction.Select(id)); // 元のTour of Heroesではサーバに問い合わせているが、処理が重くなるのでクライアントで完結するよう変更している
  }

  goBack(): void {
    this.location.back();
  }

  save(hero: Hero): void {
    this.store.dispatch(new HeroAction.Update(hero))
      .subscribe(() => this.goBack());
  }
}
