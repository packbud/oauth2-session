import {SessionStore} from './session-store';

export interface StoreFactory {
  (): SessionStore;
}