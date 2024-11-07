import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {  of } from 'rxjs';
import { map, catchError, exhaustMap } from 'rxjs/operators';
import * as fromActions from '../actions/user.actions';
import { UserService } from '../services/user.service';
import { Store } from '@ngrx/store';
import { LOADING_STATUS, User, Users, UsersData } from '../reducers/app.states';

@Injectable()
export class UserEffects {
  private actions$ = inject(Actions);
  private userService = inject(UserService);
  private store = inject( Store<Users>);
  constructor() {}

  getUsers$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.LoadUsers),
    exhaustMap(({page}:{page:number}) =>{
        this.store.dispatch(fromActions.LoadingChange({loading:LOADING_STATUS.loading}))
        return this.userService.getUsers(page).pipe(
          map((usersData:UsersData|null) => {
            if(!usersData) throw new Error()
            this.store.dispatch(fromActions.LoadingChange({loading:LOADING_STATUS.loaded_done}))
            return fromActions.LoadUsersSuccess(usersData);
          }),
          catchError(error => {
            this.store.dispatch(fromActions.LoadingChange({loading:LOADING_STATUS.NOT_LOADED}))
            return of(fromActions.LoadUsersFailure(error))}),
        )
      })
  ));

  getUser$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.SelectedUser),
    exhaustMap(({userId}) =>{
        this.store.dispatch(fromActions.LoadingChange({loading:LOADING_STATUS.loading}))
        return this.userService.getUserById(userId).pipe(
          map((user:User|undefined) => {
            if(user){
              this.store.dispatch(fromActions.LoadingChange({loading:LOADING_STATUS.loaded_done}))
              return fromActions.LoadUserSuccess(user);
            }
            this.store.dispatch(fromActions.LoadingChange({loading:LOADING_STATUS.NOT_LOADED}));
            return fromActions.LoadUserFailureAction({error:'ERROR'});
          }),
          catchError(error => {
            this.store.dispatch(fromActions.LoadingChange({loading:LOADING_STATUS.NOT_LOADED}))
            return of(fromActions.LoadUserFailureAction(error))}),
        )
      })
  ));

}
