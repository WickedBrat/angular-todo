import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { SUBSCRIPTION_ONLINE_USERS, MUTATION_UPDATE_LAST_SEEN } from 'src/app/core/operations';
import * as moment from 'moment';

@Component({
  selector: 'app-online',
  templateUrl: './online.component.html',
  styleUrls: ['./online.component.scss']
})
export class OnlineComponent implements OnInit {

  onlineUsers: any[] = [];

  constructor(public apollo: Apollo) { }

  ngOnInit() {
    this.getOnlineUsers();
    setInterval(this.updateLastSeen.bind(this), 5000);
  }

  getOnlineUsers() {
    this.apollo.subscribe({
      query: SUBSCRIPTION_ONLINE_USERS
    }).subscribe((data: any) => {
      this.onlineUsers = (data);
    });
  }

  updateLastSeen() {
    this.apollo.mutate({
      mutation: MUTATION_UPDATE_LAST_SEEN,
      variables: {
        userId: localStorage.getItem('user_id'),
        timestamp: moment().format()
      }
    }).subscribe((data: any) => {
    });
  }
}
