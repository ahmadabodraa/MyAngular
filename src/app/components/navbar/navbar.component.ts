import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { Store } from '@ngrx/store';
import { LOADING_STATUS, User, Users } from '../../reducers/app.states';
import * as fromActions from '../../actions/user.actions';
import { Subject, map, of, switchMap,takeUntil, throttleTime,} from 'rxjs';
import { UserService } from '../../services/user.service';
import { getUsersInfo } from '../../reducers/user.reducer';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    FormsModule,
    MatIconModule,
    MatInputModule
  ],
  templateUrl:'./navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  search$=new Subject<number>();
  private store= inject(Store<Users>);
  router=inject(Router)
  shouldShowSearch: boolean = false;
  destroy$=new Subject<void>();


  constructor(private userService:UserService){
    this.search$.pipe(
      throttleTime(100),
      switchMap(userId=>{
        this.store.dispatch(fromActions.ClearSearchAction());
        if(!userId)return of(null)
        this.store.dispatch(fromActions.LoadingChange({loading:LOADING_STATUS.loading}))
        return this.store.select(getUsersInfo).pipe(
          map(({data:users})=>users.find(user=>user.id==userId)) || null).pipe(
            switchMap(user=>{
              if(!user)
                return this.userService.getUserById(userId)
              return of(user)
            })
          )
      })
    ).subscribe((user:Partial<User | null | undefined>)=>{
      if(user)
        this.store.dispatch(fromActions.LoadUserSuccess(user as User));
      });
  }

  ngOnInit() {
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.shouldShowSearch = this.router.url.endsWith('/users');
      }
    });
  }

  search(event:Event){
    this.search$.next(+(event.target as HTMLInputElement).value)
  }

}
