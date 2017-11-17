import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {Authenticator} from './authenticator';
import {UserCredentials} from '../user-credentials';

export abstract class BaseAuthenticator implements Authenticator {
  abstract authenticate(credentials: UserCredentials): Observable<any>;
  abstract refresh(data: any): Observable<any>;
  abstract restore(data: any): Observable<any>;
  abstract isExpired(data: any): boolean;
  abstract isValid(data: any): boolean;
}