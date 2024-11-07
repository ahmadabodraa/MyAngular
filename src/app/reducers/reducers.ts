import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './app.states';
import * as fromReducer from './user.reducer';

export const reducers: ActionReducerMap<AppState> = {
  users: fromReducer.userReducer
};
 