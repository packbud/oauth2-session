import {Observable} from 'rxjs/Observable';
import {UserCredentials} from '../user-credentials';

export interface Authenticator {
  authenticate(credentials: UserCredentials): Observable<any>;
  refresh(data: any): Observable<any>;
  restore(data: any): Observable<any>;
  isExpired(data: any): boolean;
  isValid(data: any): boolean;
}