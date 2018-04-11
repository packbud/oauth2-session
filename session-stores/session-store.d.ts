import { Observable } from 'rxjs/Observable';
import { SessionData } from '../session-data';
export interface SessionStore {
    persist(data: SessionData): Observable<boolean>;
    restore(): Observable<SessionData>;
    clear(): Observable<boolean>;
}
