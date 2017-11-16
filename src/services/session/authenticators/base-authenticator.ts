import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {Authenticator} from './authenticator';
import {UserCredentials} from '../user-credentials';

export abstract class BaseAuthenticator implements Authenticator {
  private sessionDataUpdated: Subject<any>;

  constructor() {
    this.sessionDataUpdated = new Subject();
  }

  get onSessionDataUpdated(): Observable<any> {
    return null;
  }

  abstract authenticate(credentials: UserCredentials): Observable<any>;
  abstract refresh(data: any): Observable<any>;
  abstract restore(data: any): Observable<any>;

  triggerSessionDataUpdated(data: any): void {
    this.sessionDataUpdated.next(data);
  }

  abstract isExpired(data: any): boolean;
  abstract isValid(data: any): boolean;
}