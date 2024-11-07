
export interface AppState {
	users: Users;
}
export enum LOADING_STATUS{
	NOT_LOADED='NOT_LOADED',
	loaded_failed='loaded_failed',
	loading='loading',
	loaded_done='loaded_done'
}
export interface User {
	id: number;
	first_name: string;
	last_name: string;
	avatar: string;
}
export interface UsersData {
	data: User[];
	page:number;
	per_page:number;
	total:number;
	total_pages:number
}
export interface Users {
	page: number;
	usersData: UsersData;
	selectedUser: User|null;
	loading: LOADING_STATUS;
	error: any;
	searchedUser: User|null;
}
