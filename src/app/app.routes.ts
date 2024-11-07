import { Routes } from '@angular/router';
import { UserComponent } from './components/user/user.component';
import { CardsComponent } from './components/cards/cards.component';

export const routes: Routes = [{
    path: '',
    component: CardsComponent
  },
  {
    path: 'users',
    component: CardsComponent
  },
  {
    path: 'users/:id',
    component:UserComponent
  }
];
