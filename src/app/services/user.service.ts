import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { User, UsersData } from '../reducers/app.states';


@Injectable({
    providedIn:'root'
})
export class UserService {

    constructor(
        private http:HttpClient
    ) { }
    users_endpoint = "https://reqres.in/api/users";
    getUsers(page:number): Observable<UsersData|null> {
        if(localStorage.getItem(`users_${page}`)) return of(JSON.parse(localStorage.getItem(`users_${page}`)!))
        return this.http.get<UsersData>(this.users_endpoint + `?page=${page}`)
        .pipe(
            tap((usersData)=> localStorage.setItem(`users_${page}`,JSON.stringify(usersData))),
            catchError((err)=>{
                return of(null)
            })
        );
    }

    getUserById(id: number): Observable<User|undefined> {
        console.log("getUserById",id);
        return this.http.get<{data:User}>(this.users_endpoint + `/${id}`).pipe(
            map(data=>{
                return data.data;
            }),
            catchError((err:HttpErrorResponse)=>{
                return of(JSON.stringify(err.error) as any)
            })
        );
    }
    createUser(user: User): Observable<User> {
        return this.http.post<User>(this.users_endpoint, user);
    }
}
