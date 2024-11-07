import { createFeatureSelector, createSelector, createReducer, on, Action } from '@ngrx/store';
import * as fromActions from '../actions/user.actions';
import { LOADING_STATUS, Users } from './app.states';

export const initialState: Users = {
  page:0,
  usersData: {
    data: [],
    page:1,
    per_page:1,
    total:1,
    total_pages:1,
  },
  selectedUser: null,
  error: null,
  loading: LOADING_STATUS.loaded_failed,
  searchedUser:null
};

// Creating reducer
const _userReducer = createReducer(
  initialState,
  on(fromActions.LoadUsers, (state,{page}) => ({ ...state ,page, loading:LOADING_STATUS.loading})),
  on(fromActions.LoadUsersSuccess, (state, usersData) => ({ ...state, loading:LOADING_STATUS.loaded_done, usersData })),
  on(fromActions.LoadUsersFailure, (state, { error }) => ({ ...state,loading:LOADING_STATUS.NOT_LOADED, error })),

  on(fromActions.LoadingChange, (state,{loading}) => ({ ...state ,loading})),

  on(fromActions.LoadUserSuccess, (state, searchedUser) => ({ ...state, searchedUser, loading:LOADING_STATUS.loaded_done})),
  on(fromActions.LoadUserFailureAction, (state,error) => ({ ...state, searchedUser:null,selectedUser:null, error, status:LOADING_STATUS.NOT_LOADED})),
  on(fromActions.ClearSearchAction, (state) => ({ ...state, searchedUser:null, loading:LOADING_STATUS.loaded_failed})),

);

export function userReducer(state: any, action: Action) {
  return _userReducer(state, action);
}

// Creating selectors
export const getUsersInfotate = createFeatureSelector<Users>('users');

export const getUsersInfo = createSelector(
    getUsersInfotate,
    (state: Users) => state.usersData
);

export const getError = createSelector(
  getUsersInfotate,
  (state: Users) => state.error
);

export const getSelectedUser = createSelector(
  getUsersInfotate,
  (state: Users) => state.selectedUser
);
export const getPage = createSelector(
  getUsersInfotate,
  (state: Users) => state.page
);
export const getLoadingState = createSelector(
  getUsersInfotate,
  (state: Users) => state.loading
);
export const getPageIndex = createSelector(
  getUsersInfotate,
  (state: Users) => state.usersData.page
);

export const getSearchedUser = createSelector(
  getUsersInfotate,
  (state: Users) => state.searchedUser
);
