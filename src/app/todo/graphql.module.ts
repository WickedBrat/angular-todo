import { NgModule } from '@angular/core';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Apollo, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { GRAPHQL_URL, HASURA_ACCESS_KEY, REALTIME_GRAPHQL_URL } from '../../environments/environment';
import { WebSocketLink } from 'apollo-link-ws';

import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import ApolloClient from 'apollo-client';
import { setContext } from 'apollo-link-context';

@NgModule({
  exports: [HttpClientModule, ApolloModule]
})
export class GraphqlModule {
  constructor(apollo: Apollo) {

    const authHeader = new HttpHeaders()
      .set('X-Hasura-Access-Key', HASURA_ACCESS_KEY)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ` + localStorage.getItem('id_token'))
      .set('X-Hasura-Role', 'user')
      .set('X-Hasura-User-Id', localStorage.getItem('user_id'));

    // Create a HTTP Link with the URI and the header.
    // const http = httpLink.create({ uri, headers: authHeader });

    const authLink = setContext((_, { headers }) => {
      const token = localStorage.getItem('id_token');
      return {
        headers: {
          ...headers,
          Authorization: token ? `Bearer ${token}` : ''
        }
      };
    });

    const http = new HttpLink({
      uri: GRAPHQL_URL,
      fetch,
      headers: authHeader
    });

    // Create a WebSocket link:
    const wsLink = new WebSocketLink(
      new SubscriptionClient(REALTIME_GRAPHQL_URL, {
        reconnect: true,
        timeout: 30000,
        connectionParams: {
          headers: authHeader
        }
      })
    );

    // chose the link to use based on operation
    const link = split(
      // split based on operation type
      ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
      },
      wsLink,
      http
    );
    // Create an Apollo client with HTTP Link and cache as InMemoryCache.
    apollo.create({
      link: authLink.concat(link),
      cache: new InMemoryCache({
        addTypename: true
      })
    });
  }
}
