import {Observable} from 'rxjs/Observable';
import {SessionData} from '../session-data';
import {SessionStore} from './session-store';

import 'rxjs/add/observable/of';

export class TestStorage implements SessionStore {
  constructor(public data: any = {}) {

  }

  persist(data: SessionData): Observable<boolean> {
    this.data = data;
    return Observable.of(true);
  }

  restore(): Observable<SessionData> {
    return Observable.of(this.data);
  }

  clear(): Observable<boolean> {
    this.data = {};
    return Observable.of(true);
  }
}