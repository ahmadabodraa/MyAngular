import { Component, OnDestroy } from '@angular/core';
import { Observable, shareReplay, take } from 'rxjs';
import * as fromReducer from '../../reducers/user.reducer';
import { Store } from '@ngrx/store';
import { LOADING_STATUS, User, Users, UsersData } from '../../reducers/app.states';

import * as fromActions from '../../actions/user.actions';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatMenuModule} from '@angular/material/menu';
import { UserCardComponent } from '../user-card/user-card.component';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss'],
  standalone:true,
  imports:[CommonModule,RouterModule,MatProgressSpinnerModule,MatMenuModule,MatPaginatorModule,UserCardComponent],
})
export class CardsComponent implements OnDestroy{

	usersData$: Observable<UsersData>;
  searchedUser$: Observable<User|null>;
	loading$: Observable<LOADING_STATUS>;
  pageIndex:number=0;
  isSearchedUser=false
  searchedUser:User

  constructor(private store: Store<Users>) {
    this.store.dispatch(fromActions.ClearSearchAction());
    this.usersData$ = this.store.select(fromReducer.getUsersInfo);
    this.usersData$.pipe(take(1)).subscribe(users_info=>{
      if(!users_info.data.length){
          return this.pickUsers(1)
      }
    });
    this.loading$ = this.store.select(fromReducer.getLoadingState).pipe(shareReplay())
    this.store.select(fromReducer.getPageIndex).pipe(take(1)).subscribe(pageIndex=>this.pageIndex=pageIndex-1)
    this.store.select(fromReducer.getSearchedUser).subscribe(user=>{
      if(user)
        this.searchedUser=user
      this.isSearchedUser=!!user

    })
		this.searchedUser$ = this.store.select(fromReducer.getSearchedUser).pipe(shareReplay());
  }

  pickUsers(page:number){
		this.store.dispatch(fromActions.LoadUsers({page}));
	}


  paginatorChanged({pageIndex}:PageEvent){
    this.pageIndex=pageIndex;
    this.pickUsers(pageIndex+1);
  }

  ngOnDestroy(): void {
    this.store.dispatch(fromActions.ClearSearchAction());
  }

}
