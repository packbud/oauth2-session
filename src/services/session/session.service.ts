import {Injectable, Optional} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {Authenticator} from './authenticators';
import {Authorizer} from './authorizers';
import {PlainHeaders} from './plain-headers';
import {SessionData} from './session-data';
import {SessionOptions} from './session-options';
import {SessionStore} from './session-stores';
import {UserCredentials} from './user-credentials';

import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/publishReplay';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/take';

// @Injectable()
export class Session {
  // authenticator: Authenticator;
  authenticated: Observable<boolean>;
  // authorizer: Authorizer;
  data$: ReplaySubject<SessionData>;
  refresh$: Observable<any>;
  // store: SessionStore;

  constructor(private authenticator: Authenticator,
              private authorizer: Authorizer,
              private store: SessionStore) {

    this.data$ = new ReplaySubject();
    this.authenticated = this.data$.map(Session.isAuthenticatedHelper);

    this.data$.subscribe((data) => this.store.persist(data));
  }

  get onAuthenticated(): Observable<boolean> {
    return this.authenticated;
  }

  get isAuthenticated(): Observable<boolean> {
    return this.authenticated.take(1);
  }

  authenticate(credentials: UserCredentials): Observable<boolean> {
    return this.isAuthenticated
      .switchMap((isAuthenticated) => {
        if (isAuthenticated) {
          return Observable.throw(new Error('You must invalidate session first before you can authenticate it.'))
        }
        return this.authenticator.authenticate(credentials);
      })
      .do((content) => this.data$.next({content}))
      .mapTo(true);
  }

  authorize(headers: PlainHeaders = {}): Observable<PlainHeaders> {
    return this.data$.take(1)
      .switchMap((data) => {
        if (!Session.isAuthenticatedHelper(data)) {
          return Observable.throw(new Error('Session must be authenticated before you can authorize headers.'));
        }

        const authenticator = this.authenticator;
        const authorizer = this.authorizer;

        if (authenticator.isValid(data.content)) {
          if (!authenticator.isExpired(data.content)) {
            return Observable.of(authorizer.authorize(data.content, headers));
          }

          if (!this.refresh$) {
            this.refresh$ = authenticator.refresh(data.content)
              .do((content) => this.data$.next({content}))
              .finally(() => { this.refresh$ = undefined; })
              .publishReplay(1)
              .refCount();
          }

          return this.refresh$.map((content) => authorizer.authorize(content, headers))
        }

        return Observable.throw(new Error('Session data is invalid.'));
      })
    ;
  }

  invalidate(): Observable<boolean> {
    this.data$.next({});
    return Observable.of(true);
  }

  restore(): Observable<boolean> {
    return this.store.restore()
      .switchMap((restoredData) => {
        if (restoredData.content) {
          return this.authenticator.restore(restoredData.content)
        }
        return Observable.of(null);
      })
      .do((content) => this.data$.next({content}))
      .map((content) => !!content)
    ;
  }

  static isAuthenticatedHelper(data: SessionData): boolean {
    return !!data.content;
  }
}