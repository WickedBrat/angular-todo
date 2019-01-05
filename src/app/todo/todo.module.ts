import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TodoRoutingModule } from './todo-routing.module';
import { PersonalComponent } from './personal/personal.component';
import { PublicComponent } from './public/public.component';
import { OnlineComponent } from './online/online.component';
import { TodoComponent } from './todo.component';
import { GraphqlModule } from './graphql.module';

@NgModule({
  declarations: [PersonalComponent, PublicComponent, OnlineComponent, TodoComponent],
  imports: [
    CommonModule,
    TodoRoutingModule,
    GraphqlModule,
    FormsModule
  ]
})
export class TodoModule { }
