import {Injectable, Optional} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Authenticator} from './authenticators/authenticator';
import {Authorizer} from './authorizers/authorizer';
import {PlainHeaders} from './plain-headers';
import {SessionOptions} from './session-options';
import {SessionStore} from './session-stores/session-store';
import {UserCredentials} from './user-credentials';

@Injectable()
export class Session {
  authenticator: Authenticator;
  authorizer: Authorizer;
  store: SessionStore;

  constructor(@Optional() options: SessionOptions) {
    this.authenticator = options.authenticator;
    this.authorizer = options.authorizer;
    this.store = options.store;
  }

  authenticate(credentials: UserCredentials): Observable<boolean> {
    return null;
  }

  authorize(headers: PlainHeaders): Observable<PlainHeaders> {
    return null;
  }

  invalidate(): Observable<boolean> {
    return null;
  }

  restore(): Observable<boolean> {
    return null;
  }
}