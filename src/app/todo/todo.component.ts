import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    if (!authService.isAuthenticated()) {
      router.navigate(['/login']);
    }
   }

  ngOnInit() {
  }

}
