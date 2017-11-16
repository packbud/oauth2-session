import {Observable} from 'rxjs/Observable';
import {SessionData} from '../session-data.interface';

export interface SessionStore {
  persist(data: SessionData): Observable<boolean>;
  restore(): Observable<SessionData>;
  clear(): Observable<boolean>;
}