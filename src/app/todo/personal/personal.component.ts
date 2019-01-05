import { Component, OnInit } from '@angular/core';
import { QUERY_PRIVATE_TODO, MUTATION_TODO_DELETE, MUTATION_TODO_UPDATE, MUTATION_TODO_ADD } from 'src/app/core/operations';
import { Apollo } from 'apollo-angular';
import { from } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent implements OnInit {

  privateTodoItems: Array<Object>;
  privateTodoText = '';
  display = 'all';

  completed: Array<Object> = [];
  active: Array<Object> = [];

  constructor(
    private apollo: Apollo
  ) { }

  ngOnInit() {
    this.getItemsFromDB();
  }


  getItemsFromDB() {
    this.apollo
      .watchQuery<any>({
        query: QUERY_PRIVATE_TODO,
        variables: {
          userId: localStorage.getItem('user_id'),
        }
      })
      .valueChanges.subscribe(({ data }) => {
        this.privateTodoItems = data.todos;
        const source = from(this.privateTodoItems);
        source.pipe(filter(item => item['is_completed'] === true)).subscribe(val => this.completed.push(val));
        source.pipe(filter(item => item['is_completed'] === false)).subscribe(val => this.active.push(val));
      });
  }

  removePrivateTodoItem(id: any) {
    this.apollo
      .mutate<any>({
        mutation: MUTATION_TODO_DELETE,
        variables: {
          todoId: id
        }
      })
      .subscribe(({ data }) => {
        for (let i = 0; i < this.privateTodoItems.length; i++) {
          if (this.privateTodoItems[i]['id'] === id) {
            this.privateTodoItems.splice(i, 1);
          }
        }
      });
  }

  updateTodoItem(id: any, status: any) {
    this.apollo.mutate({
      mutation: MUTATION_TODO_UPDATE,
      variables: {
        todoId: id,
        set: {
          is_completed: !status
        }
      }
    }).subscribe(({ data }) => {
      for (let i = 0; i < this.privateTodoItems.length; i++) {
        if (this.privateTodoItems[i]['id'] === id) {
          this.privateTodoItems[i]['is_completed'] = !status;
        }
      }
    });
  }

  addTodoItem() {
    this.apollo.mutate({
      mutation: MUTATION_TODO_ADD,
      variables: {
        objects: [{
          text: this.privateTodoText,
          is_public: false,
          user_id: localStorage.getItem('user_id')
        }]
      }
    }).subscribe(({ data }) => {
      this.privateTodoText = '';
      this.privateTodoItems.push(data.insert_todo.returning[0]);
    });
  }
  toggle(string: string) {
    this.display = string;
  }
}
