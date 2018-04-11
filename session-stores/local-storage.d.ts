import { Observable } from 'rxjs/Observable';
import { SessionStore } from './session-store';
import { SessionData } from '../session-data';
import 'rxjs/add/observable/of';
export declare class LocalStorage implements SessionStore {
    readonly key: 'pb-session';
    persist(data?: SessionData): Observable<boolean>;
    restore(): Observable<SessionData>;
    clear(): Observable<boolean>;
}
