import {Observable} from 'rxjs/Observable';
import {SessionStore} from './session-store';
import {SessionData} from '../session-data';

import 'rxjs/add/observable/of';

export class LocalStorage implements SessionStore {
  readonly key: 'pb-session';

  persist(data: SessionData = {}): Observable<boolean> {
    const jsonText = JSON.stringify(data);
    localStorage.setItem(this.key, jsonText);
    return Observable.of(true);
  }

  restore(): Observable<SessionData> {
    const jsonText = localStorage.getItem(this.key) || '{}';
    return Observable.of(JSON.parse(jsonText));
  }

  clear(): Observable<boolean> {
    localStorage.removeItem(this.key);
    return Observable.of(true);
  }
}