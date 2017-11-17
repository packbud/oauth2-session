import {Observable} from 'rxjs/Observable';
import {BaseAuthenticator} from './base-authenticator';
import {UserCredentials} from '../user-credentials';

interface Strategy {
  authenticate?: (credentials: UserCredentials) => Observable<any>;
  refresh?: (data: any) => Observable<any>;
  restore?: (data: any) => Observable<any>;
  isExpired?: (data: any) => boolean;
  isValid?: (data: any) => boolean;
}

export class TestAuthenticator extends BaseAuthenticator {
  constructor(public strategy: Strategy = {}) {
    super();
  }

  authenticate(credentials: UserCredentials): Observable<any> {
    return this.strategy.authenticate(credentials);
  }

  refresh(data: any): Observable<any> {
    return this.strategy.refresh(data);
  }

  restore(data: any): Observable<any> {
    return this.strategy.restore(data);
  }

  isExpired(data: any): boolean {
    return this.strategy.isExpired(data);
  }

  isValid(data: any): boolean {
    return this.strategy.isValid(data);
  }
}