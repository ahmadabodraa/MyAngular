import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatMenuModule} from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { User } from '../../reducers/app.states';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports:[CommonModule,RouterModule,MatProgressSpinnerModule,MatMenuModule,MatPaginatorModule,MatTooltip]
,
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss',
})
export class UserCardComponent { 
  currentUser=input<User>();
  shouldShow=input<boolean>(true);
}
