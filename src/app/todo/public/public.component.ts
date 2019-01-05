import { Component, OnInit } from '@angular/core';
import { QUERY_PUBLIC_TODO, MUTATION_TODO_DELETE, MUTATION_TODO_UPDATE, MUTATION_TODO_ADD } from 'src/app/core/operations';
import { Apollo } from 'apollo-angular';
import { from } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss']
})
export class PublicComponent implements OnInit {

  publicTodoItems: Array<Object>;
  publicTodoText = '';
  display = 'all';

  example: Array<Object> = [];
  example1: Array<Object> = [];

  constructor(
    private apollo: Apollo
  ) { }

  ngOnInit() {
    this.getItemsFromDB();
  }


  getItemsFromDB() {
    this.apollo
      .watchQuery<any>({
        query: QUERY_PUBLIC_TODO,
        variables: {
          todoLimit: 5,
          todoId: 0
        }
      })
      .valueChanges.subscribe(({ data }) => {
        this.publicTodoItems = data.todos;
        const source = from(this.publicTodoItems);
        source.pipe(filter(item => item['is_completed'] === true)).subscribe(val => this.example.push(val));
        source.pipe(filter(item => item['is_completed'] === false)).subscribe(val => this.example1.push(val));
      });
  }

  removePublicTodoItem(id: any) {
    this.apollo
      .mutate<any>({
        mutation: MUTATION_TODO_DELETE,
        variables: {
          todoId: id
        }
      })
      .subscribe(({ data }) => {
        for (let i = 0; i < this.publicTodoItems.length; i++) {
          if (this.publicTodoItems[i]['id'] === id) {
            this.publicTodoItems.splice(i, 1);
          }
        }
      });
  }

  updateTodoItem(id: any, status: any) {
    this.apollo.mutate<any>({
      mutation: MUTATION_TODO_UPDATE,
      variables: {
        todoId: id,
        set: {
          is_completed: !status
        }
      }
    }).subscribe(({ data }) => {
      for (let i = 0; i < this.publicTodoItems.length; i++) {
        if (this.publicTodoItems[i]['id'] === id) {
          this.publicTodoItems[i]['is_completed'] = !status;
        }
      }
    });
  }

  addTodoItem() {
    this.apollo.mutate<any>({
      mutation: MUTATION_TODO_ADD,
      variables: {
        objects: [{
          text: this.publicTodoText,
          is_public: true,
          user_id: localStorage.getItem('user_id')
        }]
      }
    }).subscribe(({ data }) => {
      this.publicTodoText = '';
      this.publicTodoItems.push(data.insert_todos.returning[0]);
    });
  }

  toggle(string: string) {
    this.display = string;
  }
}
