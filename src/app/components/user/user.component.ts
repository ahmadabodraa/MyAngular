import { Store } from '@ngrx/store';
import { Component, OnInit, inject } from '@angular/core';    
import { map, Observable, of, switchMap } from 'rxjs';
import * as fromActions from '../../actions/user.actions';
import { User, Users } from '../../reducers/app.states';
import { CommonModule} from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatCardModule} from '@angular/material/card';
import { UserService } from '../../services/user.service';
import { UserCardComponent } from '../user-card/user-card.component';
import { getUsersInfo } from '../../reducers/user.reducer';

@Component({
	selector: 'app-user',
	templateUrl: 'user.component.html',
	styleUrls:['./user.component.scss'],
	standalone: true,
	imports:[CommonModule,RouterModule,MatProgressSpinnerModule,MatCardModule,UserCardComponent]
})
export class UserComponent implements OnInit {
	user$: Observable<User|undefined|null>;
	activatedRoute=inject(ActivatedRoute);
	constructor(private store: Store<Users>,private userService:UserService) {}
	
	ngOnInit(): void {
		const userId=+this.activatedRoute.snapshot.params?.['id'];
		this.store.dispatch(fromActions.SelectedUser({userId}))
		this.user$ = this.store.select(getUsersInfo).pipe(
			map(({data:users})=>users.find(user=>user.id==userId)) || null).pipe(
			  switchMap(prevProccess=>{
				if(!prevProccess)
				  return this.userService.getUserById(userId)
				else
				return of(null)
			  })
			)
	}

}	

